<?php

namespace Give\NextGen\Gateways\PayPal\PayPalStandardGateway;

use Give\Donations\Models\Donation;
use Give\Framework\EnqueueScript;
use Give\Framework\Http\Response\Types\RedirectResponse;
use Give\Framework\PaymentGateways\Commands\RedirectOffsite;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\NextGen\Framework\PaymentGateways\Traits\HandleHttpResponses;
use Give\PaymentGateways\Gateways\PayPalStandard\PayPalStandard;

class PayPalStandardGateway extends PayPalStandard implements NextGenPaymentGatewayInterface
{
    use HandleHttpResponses;

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
        return new EnqueueScript(
            self::id(),
            'build/payPalStandardGateway.js',
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

    /**
     * @inheritDoc
     * @param  array{redirectReturnUrl: string}  $gatewayData
     */
    public function createPayment(Donation $donation, $gatewayData = []): RedirectOffsite
    {
        $args = [
            'givewp-return-url' => $gatewayData['redirectReturnUrl'],
            'donation-id' => $donation->id,
        ];

        add_filter('give_gateway_paypal_redirect_args', function ($paypalPaymentArguments) use ($donation, $args) {
            $paypalPaymentArguments['return'] = $this->generateSecureGatewayRouteUrl(
                'handleSuccessPaymentReturn',
                $donation->id,
                $args
            );

            return $paypalPaymentArguments;
        });


        return parent::createPayment($donation, $gatewayData);
    }

    /**
     * @inheritDoc
     */
    protected function handleSuccessPaymentReturn(array $queryParams): RedirectResponse
    {
        if (!empty($queryParams['givewp-return-url'])) {
            return new RedirectResponse($queryParams['givewp-return-url']);
        }

        return parent::handleSuccessPaymentReturn($queryParams);
    }
}