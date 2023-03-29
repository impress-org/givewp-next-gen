<?php

namespace Give\NextGen\Gateways\PayPal\PayPalStandardGateway;

use Give\Donations\Models\Donation;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionAmountEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionDashboardLinkable;
use Give\Framework\PaymentGateways\SubscriptionModule;
use Give\Framework\Support\ValueObjects\Money;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionMode;

/**
 * @unreleased
 */
class PayPalStandardGatewaySubscriptionModule extends SubscriptionModule implements SubscriptionDashboardLinkable,
                                                                                   SubscriptionAmountEditable
{
    /**
     * @unreleased
     */
    public function createSubscription(
        Donation $donation,
        Subscription $subscription,
        $gatewayData
    ) {
      // TODO: Implement createSubscription() method.
    }

    /**
     * @unreleased
     */
    public function cancelSubscription(Subscription $subscription)
    {
        //TODO: Implement cancelSubscription() method.
    }

    /**
     * @unreleased
     */
    public function updateSubscriptionAmount(Subscription $subscription, Money $newRenewalAmount)
    {
       //TODO: Implement updateSubscriptionAmount() method.
    }

    /**
     * @unreleased
     */
    public function gatewayDashboardSubscriptionUrl(Subscription $subscription): string
    {
        //TODO: Implement gatewayDashboardSubscriptionUrl() method.
        
        $url = $subscription->mode->equals(SubscriptionMode::LIVE()) ?
            'https://test.com/' :
            'https://live/';

        return esc_url("{$url}subscriptions/$subscription->gatewaySubscriptionId");
    }
}
