<?php

namespace Give\NextGen\DonationForm\Actions;


use Give\NextGen\DonationForm\Routes\DonateRouteSignature;
use Give\NextGen\Framework\Routes\Route;

/**
 * @unreleased
 */
class GenerateDonationFormValidationRouteUrl
{
    /**
     * @unreleased
     *
     * @return string
     *
     */
    public function __invoke(): string
    {
        $signature = new DonateRouteSignature('givewp-donation-form-validation');

        $queryArgs = [
            'givewp-route-signature' => $signature->toHash(),
            'givewp-route-signature-id' => 'givewp-donation-form-validation',
            'givewp-route-signature-expiration' => $signature->expiration,
        ];

        return esc_url_raw(Route::url('validate', $queryArgs));
    }
}
