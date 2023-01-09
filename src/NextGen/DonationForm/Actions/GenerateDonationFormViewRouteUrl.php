<?php

namespace Give\NextGen\DonationForm\Actions;


/**
 * @unreleased
 */
class GenerateDonationFormViewRouteUrl
{
    /**
     * @unreleased
     */
    public function __invoke(int $formId): string
    {
        $args = [
            'givewp-route' => 'donation-form-view',
            'form-id' => $formId
        ];

        return esc_url_raw(
            add_query_arg(
                $args,
                home_url()
            )
        );
    }
}
