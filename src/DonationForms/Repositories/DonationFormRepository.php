<?php

namespace Give\DonationForms\Repositories;

use Closure;
use Give\DonationForms\Actions\ConvertDonationFormBlocksToFieldsApi;
use Give\DonationForms\Models\DonationForm;
use Give\DonationForms\ValueObjects\DonationFormMetaKeys;
use Give\Donations\ValueObjects\DonationMetaKeys;
use Give\Framework\Blocks\BlockCollection;
use Give\Framework\Database\DB;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\FieldsAPI\DonationForm as DonationFormNode;
use Give\Framework\FieldsAPI\Exceptions\NameCollisionException;
use Give\Framework\FieldsAPI\Hidden;
use Give\Framework\FieldsAPI\Section;
use Give\Framework\Models\ModelQueryBuilder;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Framework\Support\Facades\DateTime\Temporal;
use Give\Helpers\Hooks;
use Give\Log\Log;

/**
 * @since 0.1.0
 */
class DonationFormRepository
{
    /**
     * @var PaymentGatewayRegister
     */
    private $paymentGatewayRegister;

    /**
     * @since 0.1.0
     *
     * @var string[]
     */
    private $requiredProperties = [
        'status',
        'title',
        'blocks',
    ];

    /**
     * @since 0.1.0
     *
     * @param  PaymentGatewayRegister  $paymentGatewayRegister
     */
    public function __construct(PaymentGatewayRegister $paymentGatewayRegister)
    {
        $this->paymentGatewayRegister = $paymentGatewayRegister;
    }

    /**
     * Get Donation Form By ID
     *
     * @since 0.1.0
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
     * @since 0.1.0
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

        $donationForm->settings->pageSlug = wp_unique_post_slug(
            $donationForm->settings->pageSlug ?: sanitize_title($donationForm->title),
            $donationForm->id,
            $donationForm->status->getValue(),
            'give_forms',
            0
        );

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
                    'post_content' => (new BlockCollection([]))->toJson(), // @todo Repurpose as form page.
                    'post_name' => $donationForm->settings->pageSlug,
                ]);

            $donationFormId = DB::last_insert_id();

            DB::table('give_formmeta')
                ->insert([
                    'form_id' => $donationFormId,
                    'meta_key' => DonationFormMetaKeys::SETTINGS()->getValue(),
                    'meta_value' => $donationForm->settings->toJson()
                ]);

            DB::table('give_formmeta')
                ->insert([
                    'form_id' => $donationFormId,
                    'meta_key' => DonationFormMetaKeys::FIELDS()->getValue(),
                    'meta_value' => $donationForm->blocks->toJson()
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
     * @since 0.1.0
     *
     * @param  DonationForm  $donationForm
     *
     * @return void
     * @throws Exception|InvalidArgumentException
     */
    public function update(DonationForm $donationForm)
    {
        $this->validateProperties($donationForm);

        Hooks::doAction('givewp_donation_form_updating', $donationForm);

        $date = Temporal::getCurrentFormattedDateForDatabase();

        $donationForm->settings->pageSlug = wp_unique_post_slug(
            $donationForm->settings->pageSlug ?: sanitize_title($donationForm->title),
            $donationForm->id,
            $donationForm->status->getValue(),
            'give_forms',
            0
        );

        DB::query('START TRANSACTION');

        try {
            DB::table('posts')
                ->where('ID', $donationForm->id)
                ->update([
                    'post_modified' => $date,
                    'post_modified_gmt' => get_gmt_from_date($date),
                    'post_status' => $donationForm->status->getValue(),
                    'post_title' => $donationForm->title,
                    'post_content' => (new BlockCollection([]))->toJson(), // @todo Repurpose as form page.
                    'post_name' => $donationForm->settings->pageSlug,
                ]);

            DB::table('give_formmeta')
                ->where('form_id', $donationForm->id)
                ->where('meta_key', DonationFormMetaKeys::SETTINGS()->getValue())
                ->update([
                    'meta_value' => $donationForm->settings->toJson()
                ]);


            DB::table('give_formmeta')
                ->where('form_id', $donationForm->id)
                ->where('meta_key', DonationFormMetaKeys::FIELDS()->getValue())
                ->update([
                    'meta_value' => $donationForm->blocks->toJson()
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
     * @since 0.1.0
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
     * @since 0.1.0
     *
     * @param  DonationForm  $donationForm
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
     * @since 0.1.0
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
                ['post_content', 'page_content'] // @todo Repurpose as form page.
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
            if (!$enabled || !$this->paymentGatewayRegister->hasPaymentGateway($gatewayId)) {
                continue;
            }

            $gateway = $this->paymentGatewayRegister->getPaymentGateway($gatewayId);

            if (!in_array(3, $gateway->supportsFormVersions(), true)) {
                continue;
            }

            $gateways[$gatewayId] = $gateway;
        }

        if (array_key_exists($defaultGateway, $gateways)) {
            $gateways = array_merge([$defaultGateway => $gateways[$defaultGateway]], $gateways);
        }

        return $gateways;
    }

    /**
     * @since 0.4.0
     */
    public function getDefaultEnabledGatewayId(int $formId): string
    {
        $gateways = $this->getEnabledPaymentGateways($formId);

        return !empty($gateways) ? current($gateways)::id() : '';
    }

    /**
     * @since 0.1.0
     */
    public function getFormDataGateways(int $formId): array
    {
        $formDataGateways = [];

        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
            $gatewayId = $gateway::id();
            $settings = $this->getGatewayFormSettings($formId, $gateway);
            $label = give_get_gateway_checkout_label($gatewayId) ?? $gateway->getPaymentMethodLabel();

            /*
             * TODO: Make gateway arrayable
             */
            $formDataGateways[] = [
                'id' => $gatewayId,
                'label' => $label,
                'supportsSubscriptions' => $gateway->supportsSubscriptions(),
                'settings' => $settings
            ];
        }

        return $formDataGateways;
    }

    /**
     *
     * @since 0.1.0
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
     * @since 0.1.0
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
     * @since 0.1.0
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
     * @unreleased return DonationFormNode; throw NameCollisionException
     * @since 0.4.0 append formId to first section instead of last with multistep in mind.
     * @since 0.1.0
     * @throws NameCollisionException
     */
    public function getFormSchemaFromBlocks(int $formId, BlockCollection $blocks): DonationFormNode
    {
        try {
            $form = (new ConvertDonationFormBlocksToFieldsApi())($blocks, $formId);
            $formNodes = $form->all();

            /** @var Section $firstSection */
            $firstSection = $form->count() ? $formNodes[0] : null;

            if ($firstSection) {
                $firstSection->append(
                    Hidden::make('formId')
                        ->defaultValue($formId)
                        ->rules(
                            'required', 'integer',
                            function ($value, Closure $fail, string $key, array $values) use ($formId) {
                                if ($value !== $formId) {
                                    $fail('Invalid donation form ID');
                                }
                            }
                        )
                );
            }
        } catch (NameCollisionException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed converting donation form blocks to fields', compact('formId', 'blocks'));

            $form = new DonationFormNode('donation-form');
        }

        Hooks::doAction('givewp_donation_form_schema', $form, $formId);

        return $form;
    }

    /**
     * @since 0.1.0
     */
    public function isLegacyForm(int $formId): bool
    {
        $form = DB::table('posts')->select(['post_content', 'data'])->where('ID', $formId)->get();

        return empty($form->data);
    }

    /**
     * Get gateway form settings and handle any exceptions.
     *
     * @since 0.2.0
     */
    private function getGatewayFormSettings(int $formId, PaymentGateway $gateway): array
    {
        if (!method_exists($gateway, 'formSettings')) {
            return [];
        }

        try {
            return $gateway->formSettings($formId);
        } catch (\Exception $exception) {
            $gatewayName = $gateway->getName();
            Log::error("Failed getting gateway ($gatewayName) form settings", [
                'formId' => $formId,
                'gateway' => $gatewayName,
                'error' => $exception->getMessage(),
            ]);

            return [];
        }
    }
}
