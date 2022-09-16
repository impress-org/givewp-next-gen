<?php

namespace Give\NextGen\DonationForm\Repositories;

use Give\Framework\Database\DB;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\Models\ModelQueryBuilder;
use Give\Framework\Support\Facades\DateTime\Temporal;
use Give\Helpers\Hooks;
use Give\Log\Log;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ValueObjects\DonationFormMetaKeys;

/**
 * @unreleased
 */
class DonationFormRepository
{
    /**
     * @unreleased
     *
     * @var string[]
     */
    private $requiredProperties = [
        'id',
    ];

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
                    //'post_status' => $donationForm->status->getValue(),
                    'post_type' => 'give_forms',
                    'post_parent' => 0,
                ]);

            $donationFormId = DB::last_insert_id();
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
                    //'post_status' => $donationForm->status->getValue(),
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
     * @param DonationForm $donationForm
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
                ['post_title', 'formTitle'],
                ['post_content', 'blocksData']
            )
            ->attachMeta(
                'give_formmeta',
                'ID',
                'form_id',
                ...DonationFormMetaKeys::getColumnsForAttachMetaQuery()
            )
            ->where('post_type', 'give_forms');
    }
}
