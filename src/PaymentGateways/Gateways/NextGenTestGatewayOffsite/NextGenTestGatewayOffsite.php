<?php

namespace Give\PaymentGateways\Gateways\NextGenTestGatewayOffsite;

use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Framework\EnqueueScript;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Http\Response\Types\RedirectResponse;
use Give\Framework\PaymentGateways\Commands\RedirectOffsite;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\Traits\HandleHttpResponses;

/**
 * @since 0.1.0
 */
class NextGenTestGatewayOffsite extends PaymentGateway implements NextGenPaymentGatewayInterface
{
    use HandleHttpResponses;

    /**
     * @inheritDoc
     */
    public $secureRouteMethods = [
        'securelyReturnFromOffsiteRedirect'
    ];

    /**
     * @inheritDoc
     */
    public static function id(): string
    {
        return 'test-gateway-next-gen-offsite';
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
        return __('Test Gateway Offsite (v3)', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Test Gateway Offsite (v3)', 'give');
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
            'src/PaymentGateways/Gateways/NextGenTestGatewayOffsite/nextGenTestGatewayOffsite.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
    }

    /**
     * @inheritDoc
     */
    public function createPayment(Donation $donation, $gatewayData): RedirectOffsite
    {
        $redirectUrl = $this->generateSecureGatewayRouteUrl(
            'securelyReturnFromOffsiteRedirect',
            $donation->id,
            [
                'givewp-donation-id' => $donation->id,
                'givewp-return-url' => $gatewayData['successUrl']
            ]
        );

        return new RedirectOffsite($redirectUrl);
    }

    /**
     * @since 0.1.0
     *
     * @throws Exception
     */
    protected function securelyReturnFromOffsiteRedirect(array $queryParams): RedirectResponse
    {
        /** @var Donation $donation */
        $donation = Donation::find($queryParams['givewp-donation-id']);
        $donation->status = DonationStatus::COMPLETE();
        $donation->save();

        return new RedirectResponse($queryParams['givewp-return-url']);
    }

    /**
     * @inheritDoc
     */
    public function getLegacyFormFieldMarkup(int $formId, array $args): string
    {
        return false;
    }

    /**
     * @inerhitDoc
     */
    public function refundDonation(Donation $donation): bool
    {
        return false;
    }

    /**
     * @since 0.1.0
     *
     * @inerhitDoc
     */
    public function formSettings(int $formId): array
    {
        return [
            'message' => __(
                'There are no fields for this gateway and you will not be charged. This payment option is only for you to test the donation experience.',
                'give'
            ),
        ];
    }

    /**
     * @inheritDoc
     */
    public function supportsLegacyForm(): bool
    {
        return false;
    }
}
