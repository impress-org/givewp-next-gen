<?php

namespace Give\NextGen\Gateways\PayPal\PayPalStandardGateway;

use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\PaymentGateways\Gateways\PayPalStandard\PayPalStandard;

class PayPalStandardGateway extends PayPalStandard implements NextGenPaymentGatewayInterface
{

    /**
     * @inheritdoc
     */
    public function supportsLegacyForm(): bool
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public function enqueueScript(): EnqueueScript
    {
        $buildPath = 'build/payPalStandardGateway.js';
        $localPath = 'src/NextGen/Gateways/PayPal/PayPalStandardGateway/payPalStandardGateway.js';

        return new EnqueueScript(
            self::id(),
            $localPath,
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
    }

    /**
     * @inheritdoc
     */
    public function formSettings(int $formId): array
    {
        return [
            'fields' => __('PayPal Standard Gateway', 'give'),
        ];
    }

       /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return __('PayPal Standard (Next Gen)', 'give');
    }
}