<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Donations\Models\Donation;

class GenerateDonationConfirmationReceiptUrl
{
    /**
     * @unreleased
     */
    public function __invoke(Donation $donation, string $originUrl, string $originId = ''): string
    {
        return esc_url_raw(
            add_query_arg(
                [
                    'givewpDonationAction' => 'show-donation-confirmation-receipt',
                    'givewpReceiptId' => $donation->purchaseKey,
                    'givewpOriginId' => $originId
                ],
                $originUrl
            )
        );
    }
}