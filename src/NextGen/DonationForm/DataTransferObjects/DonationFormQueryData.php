<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Framework\Support\Facades\DateTime\Temporal;
use Give\NextGen\DonationForm\Actions\ConvertDonationFormBlocksToFieldsApi;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ValueObjects\DonationFormMetaKeys;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;

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
        $self->createdAt = Temporal::toDateTime($queryObject->createdAt);
        $self->updatedAt = Temporal::toDateTime($queryObject->updatedAt);
        $self->status = new DonationFormStatus($queryObject->status);
        $self->settings = json_decode($queryObject->{DonationFormMetaKeys::SETTINGS()->getKeyAsCamelCase()}, true);

        if($queryObject->blocksData) {
            $self->schema = give(ConvertDonationFormBlocksToFieldsApi::class)($self->id, $queryObject->blocksData );
        }

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
