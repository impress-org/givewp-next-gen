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
                    'givewp-event' => 'donation-completed',
                    'givewp-listener' => 'show-donation-confirmation-receipt',
                    'givewp-receipt-id' => $donation->purchaseKey,
                    'givewp-embed-id' => $originId,
                ],
                $originUrl
            )
        );
    }
}