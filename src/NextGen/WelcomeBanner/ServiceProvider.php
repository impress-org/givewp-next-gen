<?php

namespace Give\NextGen\WelcomeBanner;

use Give\Addon\View;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;


/**
 * @since 0.1.0
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        add_action('admin_notices', function() {
            echo View::load('NextGen/WelcomeBanner.welcome-banner');
        });
    }
}
