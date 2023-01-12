<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Donations\Models\Donation;

class GenerateDonationConfirmationReceiptUrl
{
    /**
     * @unreleased
     */
    public function __invoke(string $originUrl, Donation $donation): string
    {
        return esc_url_raw(
            add_query_arg(
                [
                    'givewpDonationAction' => 'show-donation-confirmation-receipt',
                    'givewpReceiptId' => $donation->purchaseKey,
                ],
                $originUrl
            )
        );
    }
}