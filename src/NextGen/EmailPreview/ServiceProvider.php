<?php

namespace Give\NextGen\EmailPreview;

use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
    /*
     * @inheritdoc
     */
    public function register()
    {
        //
    }

    /*
     * @inheritdoc
     */
    public function boot()
    {
        add_action('rest_api_init', [$this, 'registerRoutes']);
    }

    /**
     * @unreleased
     */
    public function registerRoutes()
    {
        foreach(include __DIR__ . '/routes.php' as $route => $args) {
            register_rest_route('givewp/next-gen/email-preview', $route, $args);
        }
    }
}
