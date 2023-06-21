<?php

namespace Give\PaymentGateways\Gateways\NextGenTestGateway;

use Give\Donations\Models\Donation;
use Give\Framework\PaymentGateways\Commands\PaymentComplete;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\Support\Scripts\Concerns\HasScriptAssetFile;

/**
 * @since 0.1.0
 */
class NextGenTestGateway extends PaymentGateway implements NextGenPaymentGatewayInterface
{
    use HasScriptAssetFile;

    /**
     * @unreleased
     */
    public static function apiVersion(): int
    {
        return 3;
    }

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
        return __('Test Gateway', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Test Gateway', 'give');
    }

    /**
     * @since 0.1.0
     */
    public function enqueueScript(int $formId)
    {
        $assets = $this->getScriptAsset(GIVE_NEXT_GEN_DIR . 'build/nextGenTestGateway.asset.php');

        wp_enqueue_script(
            self::id(),
            GIVE_NEXT_GEN_URL . 'build/nextGenTestGateway.js',
            $assets['dependencies'],
            $assets['version'],
            true
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
     * @inerhitDoc
     */
    public function refundDonation(Donation $donation)
    {
        // TODO: Implement refundDonation() method.
    }

    /**
     * @since 0.1.0
     */
    public function formSettings(int $formId): array
    {
        return [];
    }
}
