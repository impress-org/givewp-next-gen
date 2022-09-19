<?php

namespace Give\NextGen\DonationForm\Traits;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\Models\ModelQueryBuilder;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormQueryData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;

/**
 * @unreleased
 */
trait DonationFormCRUD
{
    /**
     * Find donation form by ID
     *
     * @unreleased
     *
     * @param int $id
     *
     * @return DonationForm|null
     */
    public static function find($id)
    {
        return give(DonationFormRepository::class)->getById($id);
    }

    /**
     * @unreleased
     *
     * @param array $attributes
     *
     * @return DonationForm
     */
    public static function create(array $attributes): DonationForm
    {
        $donationForm = new static($attributes);

        give(DonationFormRepository::class)->insert($donationForm);

        return $donationForm;
    }

    /**
     * @unreleased
     *
     * @return void
     *
     * @throws Exception|InvalidArgumentException
     */
    public function save()
    {
        if (!$this->id) {
            give(DonationFormRepository::class)->insert($this);
        } else {
            give(DonationFormRepository::class)->update($this);
        }
    }

    public function delete()
    {
        give(DonationFormRepository::class)->delete($this);
    }

    /**
     * @unreleased
     *
     * @return ModelQueryBuilder<DonationForm>
     */
    public static function query(): ModelQueryBuilder
    {
        return give(DonationFormRepository::class)->prepareQuery();
    }

    /**
     * @unreleased
     *
     * @param $object
     *
     * @return DonationForm
     */
    public static function fromQueryBuilderObject($object): DonationForm
    {
        return DonationFormQueryData::fromObject($object)->toDonationForm();
    }
}
