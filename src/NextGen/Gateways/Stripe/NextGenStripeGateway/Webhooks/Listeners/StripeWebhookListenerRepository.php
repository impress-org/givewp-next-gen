<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners;

use Give\Donations\Models\Donation;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\Subscriptions\Models\Subscription;

trait StripeWebhookListenerRepository
{
    /**
     * @unreleased
     */
    protected function shouldProcessSubscription(Subscription $subscription): bool
    {
        return $subscription->gatewayId === NextGenStripeGateway::id();
    }

    /**
     * @unreleased
     */
    protected function shouldProcessDonation(Donation $donation): bool
    {
        return $donation->gatewayId === NextGenStripeGateway::id();
    }
}