<?php

namespace Give\NextGen\EmailPreview;

use Give\NextGen\EmailPreview\Controllers\ShowEmailPreview;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;
use WP_REST_Server;

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
        add_action('rest_api_init', function() {

            register_rest_route('givewp/next-gen', 'email-preview', [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [give(ShowEmailPreview::class), '__invoke'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
                'args' => [
                    'email_type' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'form_id' => [
                        'type' => 'string',
                        'sanitize_callback' => 'absint',
                    ],
                ],
            ]);
        });
    }
}
