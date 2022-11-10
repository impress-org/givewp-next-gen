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
    public function __invoke(int $formId, array $formSettings): string
    {
        return esc_url_raw(
            add_query_arg(
                [
                    'givewp-view' => 'donation-form',
                    'form-id' => $formId,
                    'form-settings' => $formSettings
                ],
                home_url()
            )
        );
    }
}
