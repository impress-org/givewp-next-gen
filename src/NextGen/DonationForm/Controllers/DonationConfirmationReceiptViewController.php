<?php

namespace Give\NextGen\DonationForm\Controllers;

use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationMetaKeys;
use Give\Framework\QueryBuilder\QueryBuilder;
use Give\NextGen\DonationForm\DataTransferObjects\DonationConfirmationReceiptViewRouteData;
use Give\NextGen\DonationForm\ViewModels\DonationConfirmationReceiptViewModel;

class DonationConfirmationReceiptViewController
{
    /**
     * This renders the donation confirmation receipt view.
     *
     * @unreleased
     */
    public function show(DonationConfirmationReceiptViewRouteData $data): string
    {
        $donation = $this->getDonationByReceiptId($data->receiptId);

        if (!$donation) {
            return '';
        }

        return (new DonationConfirmationReceiptViewModel($donation))->render();
    }

    /**
     * @unreleased
     *
     * @return Donation|null
     */
    private function getDonationByReceiptId(string $receiptId)
    {
        return give()->donations->prepareQuery()
            ->where('post_type', 'give_payment')
            ->where('ID', function (QueryBuilder $builder) use ($receiptId) {
                $builder
                    ->select('donation_id')
                    ->from('give_donationmeta')
                    ->where('meta_key', DonationMetaKeys::PURCHASE_KEY()->getValue())
                    ->where('meta_value', $receiptId);
            })->get();
    }
}
