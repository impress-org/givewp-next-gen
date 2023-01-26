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
            $buildPath,
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
            'fields' => [
                'heading' => __('Make your donation quickly and securely with PayPal', 'give'),
                'subheading' => __('How it works', 'give'),
                'body' => __(
                    'You will be redirected to PayPal to complete your donation with your debit card, credit card, or with your PayPal account. Once complete, you will be redirected back to this site to view your receipt.',
                    'give'
                ),
            ]
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