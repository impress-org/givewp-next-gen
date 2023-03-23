<?php

namespace Give\Tests\Feature\Gateways\Stripe\Webhooks\Listeners;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGatewaySubscriptionModule;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\InvoicePaymentSucceeded;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionStatus;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;
use Stripe\Event;
use Stripe\Invoice;

class InvoicePaymentSucceededTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @unreleased
     *
     * @throws Exception
     */
    public function testShouldUpdateDonationStatusOfInitialDonation()
    {
        $subscription = Subscription::factory()->createWithDonation();
        $subscription->gatewayId = NextGenStripeGateway::id();
        $subscription->gatewaySubscriptionId = 'stripe-subscription-id';
        $subscription->save();

        $donation = $subscription->initialDonation();
        $donation->status = DonationStatus::PROCESSING();
        $donation->gatewayId = NextGenStripeGateway::id();
        $donation->gatewayTransactionId = 'stripe-payment-intent-id';
        $donation->save();

        $mockEvent = Event::constructFrom([
            'data' => [
                'object' => Invoice::constructFrom([
                    'id' => $donation->gatewayTransactionId,
                    'total' => $donation->amount->formatToMinorAmount(),
                    'currency' => $donation->amount->getCurrency()->getCode(),
                    'createdAt' => $donation->createdAt->format('U'),
                    'subscription' => $subscription->gatewaySubscriptionId,
                    'payment_intent' => 'stripe-payment-intent-id',
                ])
            ]
        ]);

        $listener = new InvoicePaymentSucceeded();

        $listener->processEvent($mockEvent);

        // Refresh donation model
        $donation = Donation::find($donation->id);

        $this->assertTrue($donation->status->isComplete());
        $this->assertCount(1, $subscription->donations);
    }

    /**
     * @unreleased
     *
     * @throws Exception
     */
    public function testShouldCreateRenewal()
    {
         /** @var PaymentGatewayRegister $registrar */
        $registrar = give(PaymentGatewayRegister::class);
        $gatewayId = NextGenStripeGateway::id();

        if ($registrar->hasPaymentGateway($gatewayId)) {
            $registrar->unregisterGateway($gatewayId);
        }

         add_filter("givewp_gateway_{$gatewayId}_subscription_module", static function(){
            return NextGenStripeGatewaySubscriptionModule::class;
        });

        $registrar->registerGateway(NextGenStripeGateway::class);

        $subscription = Subscription::factory()->createWithDonation([
            'status' => SubscriptionStatus::ACTIVE(),
            'installments' => 0,
            'gatewaySubscriptionId' => 'stripe-subscription-id',
        ]);

        $subscription->gatewayId = NextGenStripeGateway::id();
        $subscription->save();

        $donation = $subscription->initialDonation();
        $donation->gatewayId = NextGenStripeGateway::id();
        $donation->gatewayTransactionId = 'stripe-payment-intent-id';
        $donation->save();

        $mockEvent = Event::constructFrom([
            'data' => [
                'object' => Invoice::constructFrom([
                    'id' => $donation->gatewayTransactionId,
                    'total' => $donation->amount->formatToMinorAmount(),
                    'currency' => $donation->amount->getCurrency()->getCode(),
                    'createdAt' => $donation->createdAt->format('U'),
                    'subscription' => $subscription->gatewaySubscriptionId,
                    'payment_intent' => $donation->gatewayTransactionId,
                ])
            ]
        ]);

        $listener = new InvoicePaymentSucceeded();

        $listener->processEvent($mockEvent);

        // Refresh subscription model
        $subscription = Subscription::find($subscription->id);

        $this->assertCount(2, $subscription->donations);
    }
}