<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

/**
 * @unreleased
 */
class DonationFormViewRouteData
{
    /**
     * @var string
     */
    public $formId;

    /**
     * Convert data from request into DTO
     *
     * @unreleased
     */
    public static function fromRequest(array $request): DonationFormViewRouteData
    {
        $self = new static();

        $self->formId = $request['form-id'];

        return $self;
    }
}
