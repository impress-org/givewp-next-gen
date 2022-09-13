<?php

namespace Give\FormBuilder\Routes;

use WP_REST_Request;

class RegisterFormBuilderRestRoutes
{
    /**
     * @unreleased
     *
     * @return void
     */
    public function __invoke()
    {
        $this->registerGetForm();
        $this->registerPostForm();
    }

    /**
     * Get Request
     *
     * @unreleased
     *
     * @return void
     */
    public function registerGetForm()
    {
        register_rest_route('givewp/next-gen', '/form/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                return [
                    'blocks' => get_post($request->get_param('id'))->post_content,
                    'settings' => get_post_meta($request->get_param('id'), 'formBuilderSettings', true),
                ];
            },
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'args' => [
                'id' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                ],
            ],
        ]);
    }

    /**
     * Post Request
     *
     * @unreleased
     *
     * @return void
     */
    public function registerPostForm()
    {
        register_rest_route('givewp/next-gen', '/form/(?P<id>\d+)', [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                $settings = json_decode($request->get_param('settings'));
                $meta = update_post_meta(
                    $request->get_param('id'),
                    'formBuilderSettings',
                    $request->get_param('settings')
                );
                $post = wp_update_post([
                    'ID' => $request->get_param('id'),
                    'post_content' => $request->get_param('blocks'),
                    'post_title' => $settings->formTitle,
                ]);

                return [
                    $meta,
                    $post,
                ];
            },
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'args' => [
                'id' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                ],
                'blockData' => [
                    'type' => 'string',
                ],
            ],
        ]);
    }
}
