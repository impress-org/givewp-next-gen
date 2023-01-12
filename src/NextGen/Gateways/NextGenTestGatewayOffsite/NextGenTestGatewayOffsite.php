<?php
namespace Give\NextGen\Gateways\NextGenTestGatewayOffsite;

use Give\Donations\Models\Donation;
use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Commands\RedirectOffsite;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\Traits\HasRequest;
use Give\NextGen\DonationForm\Actions\GenerateDonationConfirmationReceiptUrl;

/**
 * @unreleased
 */
class NextGenTestGatewayOffsite extends PaymentGateway implements NextGenPaymentGatewayInterface
{
    use HasRequest;

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
        return __('Test Gateway Next Gen Offsite', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Test Gateway Next Gen Offsite', 'give');
    }

    /**
     * @unreleased
     *
     * @return EnqueueScript
     */
    public function enqueueScript(): EnqueueScript
    {
        return new EnqueueScript(
            self::id(),
            'src/NextGen/Gateways/NextGenTestGatewayOffsite/nextGenTestGatewayOffsite.js',
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
        $receiptUrl = $this->generateRedirectReturnUrl($donation, $gatewayData['originUrl'], $gatewayData['originId']);
        $redirectUrl = $this->getRedirectUrl($receiptUrl, $donation);

        return new RedirectOffsite($redirectUrl);
    }

    /**
     * @unreleased
     */
    protected function getRedirectUrl(string $receiptUrl, Donation $donation): string
    {
        return $this->generateSecureGatewayRouteUrl(
            'securelyReturnFromOffsiteRedirect',
            $donation->id,
            [
                'givewp-donation-id' => $donation->id,
                'givewp-return-url' => rawurlencode($receiptUrl)
            ]
        );
    }

    /**
     * @unreleased
     */
    protected function securelyReturnFromOffsiteRedirect(array $queryParams)
    {
        wp_redirect($queryParams['givewp-return-url']);
    }

    /**
     * @inheritDoc
     */
    public function getLegacyFormFieldMarkup(int $formId, array $args): string
    {
       return 'Legacy Stripe Fields Not Supported.';
    }

    /**
     * @inerhitDoc
     */
    public function refundDonation(Donation $donation): bool
    {
        return false;
        // TODO: Implement refundDonation() method.
    }

    /**
     * @unreleased
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
     * @unreleased
     *
     * TODO: This should be moved into the framework
     */
    public function generateRedirectReturnUrl(Donation $donation, string $originUrl, string $originId = ''): string
    {
        return !empty($originId) ? (new GenerateDonationConfirmationReceiptUrl())(
            $donation,
            $originUrl,
            $originId
        ) : give_get_success_page_uri();
    }
}
