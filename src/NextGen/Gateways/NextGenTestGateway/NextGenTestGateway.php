<?php

namespace Give\NextGen\Gateways\NextGenTestGateway;

use Exception;
use Give\Donations\Models\Donation;
use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Commands\GatewayCommand;
use Give\Framework\PaymentGateways\Commands\PaymentComplete;
use Give\Framework\PaymentGateways\Commands\SubscriptionComplete;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\NextGen\Framework\PaymentGateways\Traits\HandleHttpResponses;
use Give\Subscriptions\Models\Subscription;
use Give\Subscriptions\ValueObjects\SubscriptionStatus;

/**
 * @since 0.1.0
 */
class NextGenTestGateway extends PaymentGateway implements NextGenPaymentGatewayInterface
{
    use HandleHttpResponses;

    /**
     * @inheritDoc
     */
    public static function id(): string
    {
        return 'test-gateway-next-gen';
    }

    /**
     * @inheritDoc
     */
    public function getId(): string
    {
        return self::id();
    }

    /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return __('Test Gateway (Next Gen)', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Test Gateway (Next Gen)', 'give');
    }

    /**
     * @since 0.1.0
     *
     * @return EnqueueScript
     */
    public function enqueueScript(): EnqueueScript
    {
        return new EnqueueScript(
            self::id(),
            'build/nextGenTestGateway.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
    }

    /**
     * @inheritDoc
     */
    public function getLegacyFormFieldMarkup(int $formId, array $args): string
    {
        return false;
    }

    /**
     * @inheritDoc
     */
    public function createPayment(Donation $donation, $gatewayData)
    {
        $intent = $gatewayData['testGatewayIntent'];
        $transactionId = "test-gateway-transaction-id-{$intent}-{$donation->id}-";

        return new PaymentComplete($transactionId);
    }

    /**
     * @inheritDoc
     *
     * @unreleased
     */
    public function createSubscription(
        Donation $donation,
        Subscription $subscription,
        $gatewayData = null
    ): GatewayCommand {
        return new SubscriptionComplete(
            "test-gateway-transaction-id-$donation->id",
            "test-gateway-subscription-id-$subscription->id"
        );
    }

    /**
     * @unreleased
     *
     * @inheritDoc
     * @throws Exception
     */
    public function cancelSubscription(Subscription $subscription)
    {
        $subscription->status = SubscriptionStatus::CANCELLED();
        $subscription->save();
    }


    /**
     * @inerhitDoc
     */
    public function refundDonation(Donation $donation)
    {
        // TODO: Implement refundDonation() method.
    }

    public function formSettings(int $formId): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function supportsLegacyForm(): bool
    {
        return false;
    }
}
