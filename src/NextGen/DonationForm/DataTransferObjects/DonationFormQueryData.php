<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\NextGen\DonationForm\Actions\ConvertDonationFormBlocksToFieldsApi;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ValueObjects\DonationFormMetaKeys;

class DonationFormQueryData
{
    /**
     * @var int
     */
    public $id;

    /**
     * @var string
     */
    public $formTitle;

    /**
     * @var string
     */
    public $schema;

    /**
     * @var array
     */
    public $settings;

    /**
     * Convert data from object to Donation Form
     *
     * @unreleased
     *
     * @param object $queryObject
     *
     * @return DonationFormQueryData
     */
    public static function fromObject($queryObject): DonationFormQueryData
    {
        $self = new static();
        $self->id = (int)$queryObject->id;
        $self->formTitle = $queryObject->formTitle;
        $self->schema = give(ConvertDonationFormBlocksToFieldsApi::class)($self->id, $queryObject->blocksData );
        $self->settings = json_decode($queryObject->{DonationFormMetaKeys::SETTINGS()->getKeyAsCamelCase()}, true);

        return $self;
    }

    /**
     * Convert DTO to Donation Form
     *
     * @return DonationForm
     */
    public function toDonationForm(): DonationForm
    {
        $attributes = get_object_vars($this);

        return new DonationForm($attributes);
    }
}
