<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use function strlen;

/**
 * @unreleased
 */
class DonationConfirmationReceiptViewRouteData
{
    /**
     * @var string|null
     */
    public $receiptId;

    /**
     *
     * @unreleased
     */
    public static function fromRequest(array $request): DonationConfirmationReceiptViewRouteData
    {
        $self = new self();

        $self->receiptId = isset($request['receipt-id']) && $self->isValidReceiptId(
            $request['receipt-id']
        ) ? $request['receipt-id'] : null;

        return $self;
    }

    /**
     * @unreleased
     */
    protected function isValidReceiptId(string $receiptId): bool
    {
        return strlen($receiptId) === 32;
    }
}
