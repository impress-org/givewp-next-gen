<?php

namespace Give\NextGen\Gateways\Stripe;

use Give\Donations\Models\Donation;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;

class LegacyStripeAdapter {
    /**
     * This adds the Stripe details to the donation details page.
     *
     * @unreleased
     */
    public function addDonationDetails()
    {
         /**
         * Transaction ID link in donation details
         */
        add_filter(
            sprintf('give_payment_details_transaction_id-%s', NextGenStripeGateway::id()),
            'give_stripe_link_transaction_id',
            10,
            2
        );

          add_action('give_view_donation_details_payment_meta_after', static function ($donationId) {
            /** @var Donation $donation */
            $donation = Donation::find($donationId);

            if ($donation->gatewayId === NextGenStripeGateway::id()) {
                $stripeAccounts = give_stripe_get_all_accounts();
                $accountId = give_get_meta($donationId, '_give_stripe_account_slug', true);
                $accountDetail = $stripeAccounts[$accountId] ?? [];
                $account = 'connect' === $accountDetail['type'] ?
                    "{$accountDetail['account_name']} ({$accountId})" :
                    give_stripe_convert_slug_to_title($accountId);
                ?>
                <div class="give-donation-stripe-account-used give-admin-box-inside">
                    <p>
                        <strong><?php
                            esc_html_e('Stripe Account:', 'give'); ?></strong><br/>
                        <?php
                        echo $account; ?>
                    </p>
                </div>
                <?php
            }
        });
    }
}