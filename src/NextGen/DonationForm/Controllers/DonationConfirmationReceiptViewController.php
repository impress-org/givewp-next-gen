<?php

namespace Give\NextGen\DonationForm\Controllers;

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
        $donation = give()->donations->getByPurchaseKey($data->receiptId);

        if (!$donation) {
            return '';
        }

        return (new DonationConfirmationReceiptViewModel($donation))->render();
    }
}
