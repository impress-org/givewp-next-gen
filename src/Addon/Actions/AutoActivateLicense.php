<?php

namespace Give\Addon\Actions;

use Give\Log\Log;
use Give_License;

class AutoActivateLicense
{
    public function __invoke($productId, $license)
    {
        $response = Give_License::request_license_api([
            'edd_action' => 'activate_license',
            'item_id' => $productId,
            'license' => $license,
        ], true);

        if(!$this->validate($response)) {
            Log::error('Failed to activate license for the Visual Donation Form Builder.', [
                'license' => $license,
                'productId' => $productId,
                'response' => $response,
            ]);
        }
    }

    protected function validate($response): bool
    {
        return ! is_wp_error($response) && $response['success'];
    }
}
