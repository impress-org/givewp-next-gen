<?php

namespace Give\NextGen\DonationForm\Actions;


use Give\NextGen\Framework\Routes\Route;

/**
 * @since 0.1.0
 */
class GenerateAuthUrl
{
    /**
     * @since 0.1.0
     */
    public function __invoke(): string
    {
        return esc_url(Route::url('authenticate'));
    }
}
