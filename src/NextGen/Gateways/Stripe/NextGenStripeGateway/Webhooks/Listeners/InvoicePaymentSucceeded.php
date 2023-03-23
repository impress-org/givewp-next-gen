<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Donations\ValueObjects\DonationType;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Support\Facades\DateTime\Temporal;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionStatus;
use Stripe\Event;
use Stripe\Invoice;

/**
 * @unreleased
 */
class InvoicePaymentSucceeded
{
    use StripeWebhookListenerRepository;

    /**
     * Processes invoice.payment_succeeded event.
     *
     * Occurs whenever an invoice payment attempt succeeds.
     *
     * @see https://stripe.com/docs/api/events/types#event_types-invoice.payment_succeeded
     *
     * @unreleased
     *
     * @return void
     * @throws \Exception
     */
    public function __invoke(Event $event)
    {
        /* @var Invoice $invoice */
        $invoice = $event->data->object;

        $subscription = give()->subscriptions->queryByGatewaySubscriptionId($invoice->subscription)->get();

        // only use this for next gen for now
        if (!$subscription || !$this->shouldProcessSubscription($subscription)) {
            return;
        }


        if ($initialDonation = give()->donations->getByGatewayTransactionId($invoice->payment_intent)) {
           $this->handleInitialDonation($initialDonation);

            exit;
        }

        if ($this->shouldCreateRenewal($subscription)) {
            $this->handleRenewal($subscription, $invoice);

            exit;
        }

        if ($this->shouldEndSubscription($subscription)) {
            $this->handleSubscriptionComplete($subscription);

            exit;
        }

        exit;
    }

    /**
     * @unreleased
     */
    private function shouldCreateRenewal(Subscription $subscription): bool
    {
        $billTimes = $subscription->installments;
        $totalPayments = count($subscription->donations);

        return $subscription->status->isActive() && (0 === $billTimes || $totalPayments < $billTimes);
    }

    /**
     * @unreleased
     * @throws \Exception
     */
    private function handleSubscriptionComplete(
        Subscription $subscription
    ) {
        if (0 !== $subscription->installments && (count($subscription->donations) >= $subscription->installments)) {
            $subscription->cancel();

            $subscription->status = SubscriptionStatus::COMPLETED();
            $subscription->save();
        }
    }


    /**
     * @unreleased
     *
     * @throws Exception
     */
    private function handleInitialDonation(Donation $initialDonation)
    {
         // update initial donation
        // TODO: the payment_intent.succeeded event has this same logic
        if (!$initialDonation->status->isComplete()) {
            $initialDonation->status = DonationStatus::COMPLETE();
            $initialDonation->save();

            DonationNote::create([
                'donationId' => $initialDonation->id,
                'content' => __('Payment succeeded in Stripe.', 'give'),
            ]);
        }
    }

    /**
     * @unreleased
     *
     * @throws Exception
     * @throws \Exception
     */
    private function handleRenewal(Subscription $subscription, Invoice $invoice)
    {
        $initialDonation = $subscription->initialDonation();

        // create renewal
        Donation::create([
            'amount' => Money::fromDecimal(
                give_stripe_cents_to_dollars($invoice->total),
                strtoupper($invoice->currency)
            ),
            /**
             * TODO: the payment_intent.succeeded event is going to try setting this status as complete
             */
            'type' => DonationType::RENEWAL(),
            'status' => DonationStatus::COMPLETE(),
            'createdAt' => Temporal::toDateTime(date_i18n('Y-m-d H:i:s', $invoice->created)),
            'gatewayTransactionId' => $invoice->payment_intent,
            'subscriptionId' => $subscription->id,
            'gatewayId' => $subscription->gatewayId,
            'donorId' => $subscription->donorId,
            'formId' => $subscription->donationFormId,
            /**
             * TODO: these details might need to come from $invoice object
             * It appears we do not store this on the subscription
             * so otherwise would have to reach back to the initial donation to find out (which is how legacy works).
             */
            'firstName' => $initialDonation->firstName,
            'lastName' => $initialDonation->lastName,
            'email' => $initialDonation->email,
        ]);

        $subscription->bumpRenewalDate();
        $subscription->save();
    }

    /**
     * @unreleased
     */
    private function shouldEndSubscription(Subscription $subscription): bool
    {
        return $subscription->installments !== 0 && (count($subscription->donations) >= $subscription->installments);
    }

    /**
     * @unreleased
     */
    protected function shouldProcessSubscription(Subscription $subscription): bool
    {
        return $subscription->gatewayId === NextGenStripeGateway::id();
    }
}
