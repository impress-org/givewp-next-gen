<?php

namespace Give\Tests\Feature\Gateways\Stripe\Webhooks\Listeners;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\InvoicePaymentSucceeded;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionPeriod;
use Give\Subscriptions\ValueObjects\SubscriptionStatus;
use Give\Tests\Feature\Gateways\Stripe\TestTraits\HasMockStripeAccounts;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;
use PHPUnit_Framework_MockObject_MockBuilder;
use PHPUnit_Framework_MockObject_MockObject;
use Stripe\Event;
use Stripe\Invoice;

class InvoicePaymentSucceededTest extends TestCase
{
    use RefreshDatabase, HasMockStripeAccounts;

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
        $this->addMockStripeAccounts();

        $subscription = Subscription::factory()->createWithDonation([
            'status' => SubscriptionStatus::ACTIVE(),
            'installments' => 0,
            'frequency' => 1,
            'period' => SubscriptionPeriod::MONTH(),
            'gatewaySubscriptionId' => 'stripe-subscription-id',
            'gatewayId' => NextGenStripeGateway::id(),
        ]);

        // refresh subscription model
        $subscription = Subscription::find($subscription->id);

        $donation = $subscription->initialDonation();
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
                    'payment_intent' => 'new-stripe-payment-intent-id'
                ])
            ]
        ]);

        $listener = new InvoicePaymentSucceeded();

        $listener->processEvent($mockEvent);

        // Refresh subscription model
        $subscription = Subscription::find($subscription->id);

        $this->assertCount(2, $subscription->donations);
        $this->assertTrue($subscription->status->isActive());
    }

    /**
     * @unreleased
     *
     * @throws Exception
     */
    public function testShouldCompleteSubscription()
    {
        $this->addMockStripeAccounts();

        $subscription = Subscription::factory()->createWithDonation([
            'status' => SubscriptionStatus::ACTIVE(),
            'installments' => 1,
            'frequency' => 1,
            'period' => SubscriptionPeriod::MONTH(),
            'gatewaySubscriptionId' => 'stripe-subscription-id',
            'gatewayId' => NextGenStripeGateway::id(),
        ]);

        $donation = $subscription->initialDonation();
        $donation->gatewayTransactionId = 'stripe-payment-intent-id';
        $donation->save();

        //refresh subscription model
        $subscription = Subscription::find($subscription->id);
        // cache donations
        $subscriptionDonations = $subscription->donations;
        //refresh donation model
        $donation = Donation::find($donation->id);

        $mockEvent = Event::constructFrom([
            'data' => [
                'object' => Invoice::constructFrom([
                    'id' => $donation->gatewayTransactionId,
                    'total' => $donation->amount->formatToMinorAmount(),
                    'currency' => $donation->amount->getCurrency()->getCode(),
                    'createdAt' => $donation->createdAt->format('U'),
                    'subscription' => $subscription->gatewaySubscriptionId,
                    'payment_intent' => 'new-stripe-payment-intent-id',
                ])
            ]
        ]);

        $listener = $this->createMock(
            InvoicePaymentSucceeded::class,
            function (PHPUnit_Framework_MockObject_MockBuilder $mockBuilder) {
                // partial mock gateway by setting methods on the mock builder
                $mockBuilder->setMethods(['cancelSubscription']);

                return $mockBuilder->getMock();
            }
        );

        /** @var PHPUnit_Framework_MockObject_MockObject $listener */
        $listener->expects($this->once())
            ->method('cancelSubscription')
            ->with($subscription);

        $listener->processEvent($mockEvent);

        // Refresh subscription model
        $subscription = Subscription::find($subscription->id);

        $this->assertCount(1, $subscriptionDonations);
        $this->assertTrue($subscription->status->isCompleted());
    }

    /**
     * @unreleased
     *
     * @throws Exception
     */
    public function testShouldCreateRenewalAndCompleteSubscription()
    {
        $this->addMockStripeAccounts();

        $subscription = Subscription::factory()->createWithDonation([
            'status' => SubscriptionStatus::ACTIVE(),
            'installments' => 2,
            'frequency' => 1,
            'period' => SubscriptionPeriod::MONTH(),
            'gatewaySubscriptionId' => 'stripe-subscription-id',
            'gatewayId' => NextGenStripeGateway::id(),
        ]);

        $donation = $subscription->initialDonation();
        $donation->gatewayTransactionId = 'stripe-payment-intent-id';
        $donation->save();

        //refresh subscription model
        $subscription = Subscription::find($subscription->id);

        //refresh donation model
        $donation = Donation::find($donation->id);

        $mockEvent = Event::constructFrom([
            'data' => [
                'object' => Invoice::constructFrom([
                    'id' => $donation->gatewayTransactionId,
                    'total' => $donation->amount->formatToMinorAmount(),
                    'currency' => $donation->amount->getCurrency()->getCode(),
                    'createdAt' => $donation->createdAt->format('U'),
                    'subscription' => $subscription->gatewaySubscriptionId,
                    'payment_intent' => 'new-stripe-payment-intent-id',
                ])
            ]
        ]);

        $listener = $this->createMock(
            InvoicePaymentSucceeded::class,
            function (PHPUnit_Framework_MockObject_MockBuilder $mockBuilder) {
                // partial mock gateway by setting methods on the mock builder
                $mockBuilder->setMethods(['cancelSubscription']);

                return $mockBuilder->getMock();
            }
        );

        /** @var PHPUnit_Framework_MockObject_MockObject $listener */
        $listener->expects($this->once())
            ->method('cancelSubscription');

        $listener->processEvent($mockEvent);

        // Refresh subscription model
        $subscription = Subscription::find($subscription->id);

        $this->assertCount(2, $subscription->donations);
        $this->assertTrue($subscription->status->isCompleted());
    }
}