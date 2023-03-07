<?php

namespace Give\NextGen\Gateways\PayPalCommerce;

use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\PaymentGateways\PayPalCommerce\Models\MerchantDetail;
use Give\PaymentGateways\PayPalCommerce\PayPalCommerce;
use Give\PaymentGateways\PayPalCommerce\Repositories\MerchantDetails;

/**
 * An extension of the PayPalCommerce gateway in GiveWP that supports the NextGenPaymentGatewayInterface.
 */
class PayPalCommerceGateway extends PayPalCommerce implements NextGenPaymentGatewayInterface
{
    public function enqueueScript(): EnqueueScript
    {
        return (new EnqueueScript(
            self::id(),
            'build/payPalCommerceGateway.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ));
    }

    public function formSettings(int $formId): array
    {
        /* @var MerchantDetail $merchant */
        $merchantDetailModel = give(MerchantDetail::class);
        $merchantDetailRepository = give(MerchantDetails::class);

        return [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'donationFormId' => $formId,
            'donationFormNonce' => wp_create_nonce( "give_donation_form_nonce_{$formId}" ),
            'sdkOptions' => [
                'client-id' => $merchantDetailModel->clientId,
                'merchant-id' => $merchantDetailModel->merchantIdInPayPal,
                'components' => 'hosted-fields,buttons',
                'locale' => get_locale(),
                'disable-funding' => 'credit',
                'enable-funding' => 'venmo',
                'vault' => 'true',
                'data-partner-attribution-id' => give('PAYPAL_COMMERCE_ATTRIBUTION_ID'),
                'data-client-token' => $merchantDetailRepository->getClientToken(),
            ],
        ];
    }

    /**
     * @inheritDoc
     */
    public function supportsLegacyForm(): bool
    {
        return true;
    }
}
