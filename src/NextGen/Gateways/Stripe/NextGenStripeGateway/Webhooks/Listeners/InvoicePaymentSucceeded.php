<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Donations\ValueObjects\DonationType;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Support\Facades\DateTime\Temporal;
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

    /**
     * Processes invoice.payment_succeeded event.
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
        if (!$subscription || $subscription->gatewayId !== NextGenStripeGateway::id()) {
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


        // end subscription
        $this->handleSubscriptionComplete($subscription);

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
        $subscription->status = SubscriptionStatus::COMPLETED();
        $subscription->save();

        $subscription->cancel();
    }


    /**
     * @unreleased
     *
     * @throws Exception
     */
    private function handleInitialDonation(Donation $initialDonation)
    {
         // update initial donation
        // TODO: this might already be handled by the payment_intent.succeeded event
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
     */
    private function handleRenewal(Subscription $subscription, Invoice $invoice)
    {
         // create renewal
        Donation::create([
            'amount' => give_stripe_cents_to_dollars($invoice->total),
            'status' => DonationStatus::COMPLETE(),
            'type' => DonationType::RENEWAL(),
            'subscriptionId' => $subscription->id,
            'gatewayId' => $subscription->gatewayId,
            'gatewayTransactionId' => $invoice->payment_intent,
            'donorId' => $subscription->donorId,
            'firstName' => $subscription->donor->firstName,
            'lastName' => $subscription->donor->lastName,
            'email' => $subscription->donor->email,
            'formId' => $subscription->donationFormId,
            'createdAt' => Temporal::toDateTime(date_i18n('Y-m-d H:i:s', $invoice->created)),
        ]);

        $subscription->bumpRenewalDate();
    }
}
