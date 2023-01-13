<?php

namespace Give\NextGen\DonationForm\Repositories;

use Give\Donations\ValueObjects\DonationMetaKeys;
use Give\Framework\Database\DB;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\FieldsAPI\Form;
use Give\Framework\FieldsAPI\Hidden;
use Give\Framework\FieldsAPI\Section;
use Give\Framework\Models\ModelQueryBuilder;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Framework\Support\Facades\DateTime\Temporal;
use Give\Helpers\Hooks;
use Give\Log\Log;
use Give\NextGen\DonationForm\Actions\ConvertDonationFormBlocksToFieldsApi;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ValueObjects\DonationFormMetaKeys;
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 */
class DonationFormRepository
{
    /**
     * @var PaymentGatewayRegister
     */
    private $paymentGatewayRegister;

    /**
     * @unreleased
     *
     * @var string[]
     */
    private $requiredProperties = [
        'status',
        'title',
        'blocks',
    ];

    /**
     * @unreleased
     *
     * @param PaymentGatewayRegister $paymentGatewayRegister
     */
    public function __construct(PaymentGatewayRegister $paymentGatewayRegister)
    {
        $this->paymentGatewayRegister = $paymentGatewayRegister;
    }

    /**
     * Get Donation Form By ID
     *
     * @unreleased
     *
     * @return DonationForm|null
     */
    public function getById(int $id)
    {
        return $this->prepareQuery()
            ->where('ID', $id)
            ->get();
    }

    /**
     *
     * @unreleased
     *
     * @return void
     * @throws Exception|InvalidArgumentException
     */
    public function insert(DonationForm $donationForm)
    {
        $this->validateProperties($donationForm);

        Hooks::doAction('givewp_donation_form_creating', $donationForm);

        $dateCreated = Temporal::withoutMicroseconds($donationForm->createdAt ?: Temporal::getCurrentDateTime());
        $dateCreatedFormatted = Temporal::getFormattedDateTime($dateCreated);

        DB::query('START TRANSACTION');

        try {
            DB::table('posts')
                ->insert([
                    'post_date' => $dateCreatedFormatted,
                    'post_date_gmt' => get_gmt_from_date($dateCreatedFormatted),
                    'post_modified' => $dateCreatedFormatted,
                    'post_modified_gmt' => get_gmt_from_date($dateCreatedFormatted),
                    'post_status' => $donationForm->status->getValue(),
                    'post_type' => 'give_forms',
                    'post_parent' => 0,
                    'post_title' => $donationForm->title,
                    'post_content' => $donationForm->blocks->toJson(),
                ]);

            $donationFormId = DB::last_insert_id();

            DB::table('give_formmeta')
                ->insert([
                    'form_id' => $donationFormId,
                    'meta_key' => DonationFormMetaKeys::SETTINGS()->getValue(),
                    'meta_value' => $donationForm->settings->toJson()
                ]);
        } catch (Exception $exception) {
            DB::query('ROLLBACK');

            Log::error('Failed creating a donation form', compact('donationForm'));

            throw new $exception('Failed creating a donation form');
        }

        DB::query('COMMIT');

        $donationForm->id = $donationFormId;

        $donationForm->createdAt = $dateCreated;

        if (!isset($donation->updatedAt)) {
            $donationForm->updatedAt = $donationForm->createdAt;
        }

        Hooks::doAction('givewp_donation_form_created', $donationForm);
    }

    /**
     * @unreleased
     *
     * @param DonationForm $donationForm
     *
     * @return void
     * @throws Exception|InvalidArgumentException
     */
    public function update(DonationForm $donationForm)
    {
        $this->validateProperties($donationForm);

        Hooks::doAction('givewp_donation_form_updating', $donationForm);

        $date = Temporal::getCurrentFormattedDateForDatabase();

        DB::query('START TRANSACTION');

        try {
            DB::table('posts')
                ->where('ID', $donationForm->id)
                ->update([
                    'post_modified' => $date,
                    'post_modified_gmt' => get_gmt_from_date($date),
                    'post_status' => $donationForm->status->getValue(),
                    'post_title' => $donationForm->title,
                    'post_content' => $donationForm->blocks->toJson(),
                ]);

            DB::table('give_formmeta')
                ->where('form_id', $donationForm->id)
                ->where('meta_key', DonationFormMetaKeys::SETTINGS()->getValue())
                ->update([
                    'meta_value' => $donationForm->settings->toJson()
                ]);
        } catch (Exception $exception) {
            DB::query('ROLLBACK');

            Log::error('Failed updating a donation form', compact('donationForm'));

            throw new $exception('Failed updating a donation form');
        }

        DB::query('COMMIT');

        Hooks::doAction('givewp_donation_form_updated', $donationForm);
    }

    /**
     * @unreleased
     *
     * @throws Exception
     */
    public function delete(DonationForm $donationForm): bool
    {
        DB::query('START TRANSACTION');

        Hooks::doAction('givewp_donation_form_deleting', $donationForm);

        try {
            DB::table('posts')
                ->where('id', $donationForm->id)
                ->delete();

            DB::table('give_formmeta')
                ->where('form_id', $donationForm->id)
                ->delete();
        } catch (Exception $exception) {
            DB::query('ROLLBACK');

            Log::error('Failed deleting a donation form', compact('donationForm'));

            throw new $exception('Failed deleting a donation form');
        }

        DB::query('COMMIT');

        Hooks::doAction('givewp_donation_form_deleted', $donationForm);

        return true;
    }

    /**
     * @unreleased
     *
     * @param DonationForm $donationForm
     *
     * @return void
     */
    private function validateProperties(DonationForm $donationForm)
    {
        foreach ($this->requiredProperties as $key) {
            if (!isset($donationForm->$key)) {
                throw new InvalidArgumentException("'$key' is required.");
            }
        }
    }

    /**
     * @unreleased
     *
     * @return ModelQueryBuilder<DonationForm>
     */
    public function prepareQuery(): ModelQueryBuilder
    {
        $builder = new ModelQueryBuilder(DonationForm::class);

        return $builder->from('posts')
            ->select(
                ['ID', 'id'],
                ['post_date', 'createdAt'],
                ['post_modified', 'updatedAt'],
                ['post_status', 'status'],
                ['post_title', 'title'],
                ['post_content', 'blocks']
            )
            ->attachMeta(
                'give_formmeta',
                'ID',
                'form_id',
                ...DonationFormMetaKeys::getColumnsForAttachMetaQuery()
            )
            ->where('post_type', 'give_forms');
    }

    /**
     * @return PaymentGateway[]
     */
    public function getEnabledPaymentGateways($formId): array
    {
        $gateways = [];

        $enabledGateways = give_get_option('gateways');
        $defaultGateway = give_get_default_gateway($formId);

        foreach ($enabledGateways as $gatewayId => $enabled) {
            if ($enabled && $this->paymentGatewayRegister->hasPaymentGateway($gatewayId)) {
                $gateways[$gatewayId] = $this->paymentGatewayRegister->getPaymentGateway($gatewayId);
            }
        }

        if (array_key_exists($defaultGateway, $gateways)) {
            $gateways = array_merge([$defaultGateway => $gateways[$defaultGateway]], $gateways);
        }

        return $gateways;
    }

    /**
     * @unreleased
     */
    public function getFormDataGateways(int $formId): array
    {
        $formDataGateways = [];

        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
            $gatewayId = $gateway::id();

            $formDataGateways[$gatewayId] = array_merge(
                [
                    'label' => give_get_gateway_checkout_label($gatewayId) ?? $gateway->getPaymentMethodLabel(),
                ],
                method_exists($gateway, 'formSettings') ? $gateway->formSettings($formId) : []
            );
        }

        return $formDataGateways;
    }

    /**
     *
     * @unreleased
     */
    public function getTotalNumberOfDonors(int $formId): int
    {
        return DB::table('give_donationmeta')
            ->where('meta_key', DonationMetaKeys::DONOR_ID)
            ->whereIn('donation_id', function ($builder) use ($formId) {
                $builder
                    ->select('donation_id')
                    ->from('give_donationmeta')
                    ->where('meta_key', DonationMetaKeys::FORM_ID)
                    ->where('meta_value', $formId);
            })->count('DISTINCT meta_value');
    }

    /**
     * @unreleased
     */
    public function getTotalNumberOfDonations(int $formId): int
    {
        return DB::table('posts')
            ->leftJoin('give_donationmeta', 'ID', 'donation_id')
            ->where('meta_key', DonationMetaKeys::FORM_ID)
            ->where('meta_value', $formId)
            ->count();
    }

    /**
     * @unreleased
     */
    public function getTotalRevenue(int $formId): int
    {
        $query = DB::table('give_formmeta')
            ->select('meta_value as totalRevenue')
            ->where('form_id', $formId)
            ->where('meta_key', '_give_form_earnings')
            ->get();

        if (!$query) {
            return 0;
        }

        return $query->totalRevenue;
    }

    /**
     * @unreleased
     */
    public function getFormSchemaFromBlocks(int $formId, BlockCollection $blocks): Form
    {
        $form = (new ConvertDonationFormBlocksToFieldsApi())($blocks);

        $formNodes = $form->all();

        /** @var Section $lastSection */
        $lastSection = $form->count() ? end($formNodes) : null;

        if ($lastSection) {
            $lastSection->append(
                Hidden::make('formId')
                    ->defaultValue($formId)
                    ->rules('required', 'integer'),

                Hidden::make('currency')
                    ->defaultValue(give_get_currency($formId))
                    ->rules('required', 'currency')
            );
        }

        return $form;
    }

    /**
     * @unreleased
     */
    public function isLegacyForm(int $formId): bool
    {
        $form = DB::table('posts')->select(['post_content', 'data'])->where('ID', $formId)->get();

        return empty($form->data);
    }
}
