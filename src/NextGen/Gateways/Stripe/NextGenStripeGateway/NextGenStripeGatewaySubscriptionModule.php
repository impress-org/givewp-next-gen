<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\Commands\GatewayCommand;
use Give\Framework\PaymentGateways\Commands\RespondToBrowser;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionAmountEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionDashboardLinkable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionPaymentMethodEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionTransactionsSynchronizable;
use Give\Framework\PaymentGateways\SubscriptionModule;
use Give\PaymentGateways\Gateways\Stripe\Traits\CanSetupStripeApp;
use Give\PaymentGateways\Stripe\ApplicationFee;
use Give\Subscriptions\Models\Subscription;
use GiveRecurring\Infrastructure\Exceptions\PaymentGateways\Stripe\UnableToCreateStripePlan;
use GiveRecurring\PaymentGateways\DataTransferObjects\SubscriptionDto;
use GiveRecurring\PaymentGateways\Stripe\Actions\RetrieveOrCreatePlan;
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
    ): GatewayCommand {
        $this->setUpStripeAppInfo($donation->formId);

        /**
         * Get data from client request
         */
        $stripeGatewayData = StripeGatewayData::fromRequest($gatewayData);

        /**
         * Get or create a Stripe customer
         */
        $customer = $this->getOrCreateStripeCustomerFromDonation(
            $stripeGatewayData->stripeConnectedAccountId,
            $donation
        );


        /**
         * Setup Stripe Payment Intent args
         */
        $intentArgs = $this->getPaymentIntentArgsFromDonation($donation, $customer);

        /**
         * Setup Stripe Plan
         */
        $plan = $this->createStripePlan($donation, $subscription);

        /**
         * Create Stripe Subscription
         */
        $stripeSubscription = $this->createStripeSubscription(
            $donation,
            $subscription,
            $customer,
            $plan
        );


        /**
         * Return response to client
         */
        return new RespondToBrowser([
            'clientSecret' => $stripeSubscription->latest_invoice->payment_intent->client_secret,
            'returnUrl' => $stripeGatewayData->successUrl,
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
     * @throws Exception
     * @throws \Exception
     */
    protected function createStripeSubscription(
        Donation $donation,
        Subscription $subscription,
        \Stripe\Customer $customer,
        Plan $plan
    ): \Stripe\Subscription {
        // Get metadata.
        $metadata = give_stripe_prepare_metadata($donation->id);

        /**
         * @see https://stripe.com/docs/api/subscriptions/create
         */
        $subscriptionArgs = [
            'items' => [
                [
                    'plan' => $plan->id,
                ]
            ],
            'metadata' => $metadata,
            'payment_behavior' => 'default_incomplete',
            'payment_settings' => ['save_default_payment_method' => 'on_subscription'],
            'expand' => ['latest_invoice.payment_intent'],
        ];

        /**
         * Add application fee, if the Stripe premium add-on is not active.
         *
         * TODO: Not sure about adding this - cannot find us using this for other stripe gateway subscriptions.
         */
        if (ApplicationFee::canAddfee()) {
            $subscriptionArgs['application_fee_percent'] = give_stripe_get_application_fee_percentage();
        }

        /** @var \Stripe\Subscription $stripeSubscription */
        $stripeSubscription = $customer->subscriptions->create($subscriptionArgs);

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(
            /* translators: 1. Stripe payment intent id */
                esc_html__('Stripe Payment Invoice ID: %1$s', 'give'),
                $stripeSubscription->latest_invoice->id
            )
        ]);

        /**
         * Update Subscription Meta
         */
        $this->updateSubscriptionMetaFromStripeSubscription(
            $subscription,
            $stripeSubscription
        );

        /**
         * Update Donation Meta
         */
        $this->updateDonationMetaFromPaymentIntent($donation, $stripeSubscription->latest_invoice->payment_intent);

        return $stripeSubscription;
    }
}
