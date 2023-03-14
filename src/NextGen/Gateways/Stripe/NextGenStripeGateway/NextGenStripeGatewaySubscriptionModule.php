<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

use Give\Donations\Models\Donation;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\CommandHandlers\SubscriptionCompleteHandler;
use Give\Framework\PaymentGateways\Commands\RespondToBrowser;
use Give\Framework\PaymentGateways\Commands\SubscriptionComplete;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionAmountEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionDashboardLinkable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionPaymentMethodEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionTransactionsSynchronizable;
use Give\Framework\PaymentGateways\SubscriptionModule;
use Give\PaymentGateways\Gateways\Stripe\Traits\CanSetupStripeApp;
use Give\Subscriptions\Models\Subscription;
use GiveRecurring\Infrastructure\Exceptions\PaymentGateways\Stripe\UnableToCreateStripePlan;
use GiveRecurring\PaymentGateways\DataTransferObjects\SubscriptionDto;
use GiveRecurring\PaymentGateways\Stripe\Actions\RetrieveOrCreatePlan;
use GiveRecurring\PaymentGateways\Stripe\Actions\SubscribeStripeCustomerToPlanWithCard;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanCancelStripeSubscription;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanHandleSecureCardAuthenticationRedirect;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanLinkStripeSubscriptionGatewayId;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanUpdateStripeSubscriptionAmount;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanUpdateStripeSubscriptionPaymentMethod;
use Stripe\Exception\ApiErrorException;
use Stripe\Plan;

/**
 * @unreleased
 */
class NextGenStripeGatewaySubscriptionModule extends SubscriptionModule implements SubscriptionDashboardLinkable,
                                                                    SubscriptionAmountEditable,
                                                                    SubscriptionPaymentMethodEditable,
                                                                    SubscriptionTransactionsSynchronizable
{
    use CanSetupStripeApp;
    use CanCancelStripeSubscription;
    use CanUpdateStripeSubscriptionAmount;
    use CanLinkStripeSubscriptionGatewayId;
    use CanUpdateStripeSubscriptionPaymentMethod;
    use CanHandleSecureCardAuthenticationRedirect;
    use NextGenStripeRepository;

    /**
     * @unreleased
     *
     * @throws Exception
     * @throws ApiErrorException
     * @throws \Exception
     */
    public function createSubscription(
        Donation $donation,
        Subscription $subscription,
        $gatewayData
    ): RespondToBrowser {
        /**
         * Get data from client request
         */
        $stripeConnectedAccountKey = $gatewayData['stripeConnectedAccountKey'];
        $stripePaymentIntentId = $gatewayData['stripePaymentIntentId'];
        $redirectReturnUrl = rawurldecode($gatewayData['successUrl']);

        /**
         * Get or create a Stripe customer
         */
        $customer = $this->getOrCreateStripeCustomerFromDonation($stripeConnectedAccountKey, $donation);


        /**
         * Setup Stripe Payment Intent args
         */
        $intentArgs = $this->getPaymentIntentArgsFromDonation($donation, $customer);

        /**
         * Update Payment Intent
         */
        $intent = $this->updateStripePaymentIntent(
            $stripePaymentIntentId,
            $intentArgs
        );

        /**
         * Update Donation Meta
         */
        $this->updateDonationMetaFromPaymentIntent($donation, $intent);

        /**
         * Setup Stripe Plan
         */
        $plan = $this->createStripePlan($donation, $subscription);

        /**
         * Create Stripe Subscription
         */
        $subscriptionCompleted = $this->createStripeSubscription(
            $customer,
            $donation,
            $intent,
            $plan
        );

        $this->handleSubscriptionCompleted($subscriptionCompleted, $subscription, $donation);


        /**
         * Return response to client
         */
        return new RespondToBrowser([
            'intentStatus' => $intent->status,
            'returnUrl' => $redirectReturnUrl,
        ]);
    }

    /**
     * @since 2.0.0
     *
     * @inheritDoc
     */
    public function synchronizeSubscription(Subscription $subscription)
    {
        // TODO: Implement synchronizeSubscription() method.
        // We are processing sync subscription request with legacy code (MockLegacyGiveRecurringGateway::addSyncSubscriptionActionHook)
    }

    /**
     * @unreleased
     *
     * @throws UnableToCreateStripePlan
     */
    protected function createStripePlan(Donation $donation, Subscription $subscription): Plan
    {
        return give(RetrieveOrCreatePlan::class)->handle(
            SubscriptionDto::fromArray(
                [
                    'formId' => $donation->formId,
                    'priceId' => $donation->levelId,
                    'recurringDonationAmount' => $donation->amount,
                    'period' => $subscription->period->getValue(),
                    'frequency' => $subscription->frequency,
                    'currencyCode' => $donation->amount->getCurrency(),
                ]
            )
        );
    }

    /**
     * @unreleased
     *
     * @throws \Exception
     */
    protected function handleSubscriptionCompleted(
        SubscriptionComplete $subscriptionCompleted,
        Subscription $subscription,
        Donation $donation
    ) {
        (new SubscriptionCompleteHandler())($subscriptionCompleted, $subscription, $donation);
    }

    /**
     * @throws Exception
     * @throws ApiErrorException
     */
    protected function createStripeSubscription(
        \Stripe\Customer $customer,
        Donation $donation,
        \Stripe\PaymentIntent $paymentIntent,
        Plan $plan
    ): SubscriptionComplete {
         $subscribeStripeCustomerToPlan = (new SubscribeStripeCustomerToPlanWithCard)(
            $customer,
            $donation,
            $paymentIntent->payment_method,
            $plan->id
        );

        return new SubscriptionComplete(
            $subscribeStripeCustomerToPlan->getGatewayTransactionId(),
            $subscribeStripeCustomerToPlan->getGatewaySubscriptionId()
        );
    }
}
