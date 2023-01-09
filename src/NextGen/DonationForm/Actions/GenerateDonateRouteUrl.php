<?php

namespace Give\NextGen\DonationForm\Actions;


use Give\NextGen\DonationForm\Routes\DonateRouteSignature;

/**
 * @unreleased
 */
class GenerateDonateRouteUrl
{
    /**
     * @unreleased
     *
     * @return string
     *
     */
    public function __invoke(): string
    {
        $signature = new DonateRouteSignature('givewp-donate');

        $queryArgs = [
            'givewp-route' => 'donate',
            'givewp-route-signature' => $signature->toHash(),
            'givewp-route-signature-id' => 'givewp-donate',
            'givewp-route-signature-expiration' => $signature->expiration,
        ];

        return esc_url_raw(
            add_query_arg(
                $queryArgs,
                home_url()
            )
        );
    }
}
