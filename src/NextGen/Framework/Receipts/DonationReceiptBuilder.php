<?php

namespace Give\NextGen\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\NextGen\Framework\Receipts\Actions\GenerateReceiptFromDonation;

class DonationReceiptBuilder {
    /**
     * @unreleased
     */
    public static function fromDonation(Donation $donation): DonationReceipt
    {
        return (new GenerateReceiptFromDonation())($donation);
    }
}