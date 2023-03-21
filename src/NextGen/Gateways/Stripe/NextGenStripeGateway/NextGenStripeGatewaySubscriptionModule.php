<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\Commands\GatewayCommand;
use Give\Framework\PaymentGateways\Commands\RespondToBrowser;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionAmountEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionDashboardLinkable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionPaymentMethodEditable;
use Give\Framework\PaymentGateways\Contracts\Subscription\SubscriptionTransactionsSynchronizable;
use Give\Framework\PaymentGateways\SubscriptionModule;
use Give\PaymentGateways\Gateways\Stripe\Traits\CanSetupStripeApp;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionStatus;
use GiveRecurring\Infrastructure\Exceptions\PaymentGateways\Stripe\UnableToCreateStripePlan;
use GiveRecurring\PaymentGateways\DataTransferObjects\SubscriptionDto;
use GiveRecurring\PaymentGateways\Stripe\Actions\RetrieveOrCreatePlan;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanCancelStripeSubscription;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanHandleSecureCardAuthenticationRedirect;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanLinkStripeSubscriptionGatewayId;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanUpdateStripeSubscriptionAmount;
use GiveRecurring\PaymentGateways\Stripe\Traits\CanUpdateStripeSubscriptionPaymentMethod;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Stripe\Plan;
use Stripe\Subscription as StripeSubscription;

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
        /**
         * Initialize the Stripe SDK using Stripe::setAppInfo()
         */
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
         * Update Subscription Meta
         */
        $this->updateSubscriptionMetaFromStripeSubscription(
            $subscription,
            $stripeSubscription
        );

        /**
         * Update Initial Donation Meta
         */
        $this->updateSubscriptionInitialDonationMetaFromStripeSubscription(
            $stripeSubscription,
            $donation,
            $stripeGatewayData
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
        /**
         * Legacy gateways use the levelId for the subscription name.  We are not really doing that anymore in next gen.
         * So, we can just add the amount to the subscription name.  Keeping this filter here for now since this part is preserving our logic
         * used in legacy Stripe gateways but will eventually be refactored to its own functionality.
         */
        add_filter('give_recurring_subscription_name', static function ($subscriptionName) use ($donation) {
            if ($donation->levelId) {
                return $subscriptionName;
            }

            return sprintf(
                '%1$s - %2$s',
                $subscriptionName,
                $donation->amount->formatToDecimal()
            );
        });

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
        Customer $customer,
        Plan $plan
    ): StripeSubscription {
        /**
         * @see https://stripe.com/docs/api/subscriptions/create
         *
         * Note: we do not add the application_fee_percent for subscriptions in favor of using our premium add-on give-recurring.
         * @see https://givewp.com/documentation/core/payment-gateways/stripe-free/
         */
        $subscriptionArgs = [
            'items' => [
                [
                    'plan' => $plan->id,
                ]
            ],
            'metadata' => give_stripe_prepare_metadata($donation->id),
            'payment_behavior' => 'default_incomplete',
            'payment_settings' => ['save_default_payment_method' => 'on_subscription'],
            'expand' => ['latest_invoice.payment_intent'],
        ];

        /**
         * @var StripeSubscription $stripeSubscription
         */
        $stripeSubscription = $customer->subscriptions->create($subscriptionArgs);

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(
            /* translators: 1. Stripe payment intent id */
                esc_html__('Stripe Payment Invoice ID: %1$s', 'give'),
                $stripeSubscription->latest_invoice->id
            )
        ]);

        return $stripeSubscription;
    }

    /**
     * @unreleased
     * @throws \Exception
     */
    protected function updateSubscriptionMetaFromStripeSubscription(
        Subscription $subscription,
        StripeSubscription $stripeSubscription
    ) {
        if ($stripeTransactionId = $stripeSubscription->latest_invoice->payment_intent->id) {
            $subscription->transactionId = $stripeTransactionId;
        }

        $subscription->gatewaySubscriptionId = $stripeSubscription->id;

        $subscription->status = SubscriptionStatus::ACTIVE();
        $subscription->save();
    }

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    protected function updateSubscriptionInitialDonationMetaFromStripeSubscription(
        StripeSubscription $stripeSubscription,
        Donation $donation,
        StripeGatewayData $gatewayData
    ) {
        if (!$gatewayData->stripePaymentMethodIsCreditCard) {
            $donation->status = DonationStatus::PROCESSING();
        }

        $paymentIntentId = $stripeSubscription->latest_invoice->payment_intent->id;
        $clientSecret = $stripeSubscription->latest_invoice->payment_intent->client_secret;

        $donation->gatewayTransactionId = $paymentIntentId;
        $donation->save();

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(
                __('Stripe Charge/Payment Intent ID: %s', 'give'),
                $paymentIntentId
            )
        ]);

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(
                __('Stripe Payment Intent Client Secret: %s', 'give'),
                $clientSecret
            )
        ]);

        give_update_meta(
            $donation->id,
            '_give_stripe_payment_intent_client_secret',
            $clientSecret
        );
    }
}
