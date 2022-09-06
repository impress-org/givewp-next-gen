<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\NextGen\DonationForm\Models\DonationForm;

class DonationFormQueryData
{
    /**
     * @var int
     */
    public $id;

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

        return $self;
    }

    /**
     * Convert DTO to Donation Form
     *
     * @return DonationForm
     */
    public function toDonationForm()
    {
        $attributes = get_object_vars($this);

        return new DonationForm($attributes);
    }
}
