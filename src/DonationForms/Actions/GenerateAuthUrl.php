<?php

namespace Give\DonationForm\Actions;


use Give\Framework\Routes\Route;

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
