<?php

namespace Give\NextGen\Gateways\PayPalCommerce;

use Exception;
use Give\Donations\Models\Donation;
use Give\Framework\PaymentGateways\Commands\GatewayCommand;
use Give\Framework\PaymentGateways\Commands\SubscriptionProcessing;
use Give\Framework\PaymentGateways\SubscriptionModule;
use Give\Subscriptions\Models\Subscription;

class PayPalCommerceSubscriptionModule extends SubscriptionModule
{
    /**
     * @unreleased
     */
    public function createSubscription(
        Donation $donation,
        Subscription $subscription,
        $gatewayData = null
    ): GatewayCommand {

        $subscriptionId = $gatewayData['payPalSubscriptionId'];

        return new SubscriptionProcessing($subscriptionId);
    }

    public function cancelSubscription(Subscription $subscription)
    {
        // TODO: Implement cancelSubscription() method.
    }
}
