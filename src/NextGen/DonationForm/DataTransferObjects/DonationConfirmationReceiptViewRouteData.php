<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

/**
 * @unreleased
 */
class DonationConfirmationReceiptViewRouteData
{
    /**
     * @var string
     */
    public $receiptId;

    /**
     *
     * @unreleased
     */
    public static function fromRequest(array $request): DonationConfirmationReceiptViewRouteData
    {
        $self = new self();

        $self->receiptId = (string)$request['receipt-id'];

        return $self;
    }
}
