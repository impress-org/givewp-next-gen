<?php
namespace Give\NextGen\Gateways\NextGenTestGatewayOffsite;

use Give\Donations\Models\Donation;
use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Commands\RedirectOffsite;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\Traits\HasRequest;
use Give\NextGen\DonationForm\Actions\GenerateDonationConfirmationReceiptUrl;

/**
 * @unreleased
 */
class NextGenTestGatewayOffsite extends PaymentGateway
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
        $receiptUrl = (new GenerateDonationConfirmationReceiptUrl())($gatewayData['originUrl'], $donation);
        $redirectUrl =$this->getRedirectUrl($receiptUrl, $donation);

        return new RedirectOffsite($redirectUrl);
    }

    /**
     * @unreleased
     */
    protected function getRedirectUrl(string $receiptUrl, Donation $donation, string $redirectUrlHost = ''): string
    {
        $redirectUrl = $this->generateSecureGatewayRouteUrl(
            'securelyReturnFromOffsiteRedirect',
            $donation->id,
            [
                'givewp-donation-id' => $donation->id,
                'givewp-receipt-url' => rawurlencode($receiptUrl)
            ]
        );

        if (empty($redirectUrlHost)) {
            return $redirectUrl;
        }

        return add_query_arg(
            [
                'returnUrl' => urlencode($redirectUrl)
            ],
            $redirectUrlHost
        );
    }

    /**
     * @unreleased
     */
    protected function securelyReturnFromOffsiteRedirect(array $queryParams)
    {
        wp_redirect($queryParams['givewp-receipt-url']);
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
    public function refundDonation(Donation $donation)
    {
        return false;
        // TODO: Implement refundDonation() method.
    }

}
