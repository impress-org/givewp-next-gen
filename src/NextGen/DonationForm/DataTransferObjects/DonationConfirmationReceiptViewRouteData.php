<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Log\Log;

use function compact;

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
        Log::debug('DonationConfirmationReceiptViewRouteData::fromRequest', compact('request'));
        $self = new self();

        $self->receiptId = (string)$request['receipt-id'];

        return $self;
    }
}
