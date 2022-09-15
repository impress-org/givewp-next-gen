<?php

namespace Give\FormBuilder\Routes;

use Give\FormBuilder\Controllers\FormBuilderResourceController;
use WP_REST_Request;

class RegisterFormBuilderRestRoutes
{
    /**
     * @var FormBuilderResourceController
     */
    protected $formBuilderResourceController;

    /**
     * @unreleased
     */
    public function __construct(
        FormBuilderResourceController $formBuilderResourceController
    ) {
        $this->formBuilderResourceController = $formBuilderResourceController;
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function __invoke()
    {
        $namespace = 'givewp/next-gen';
        $route = '/form/(?P<id>\d+)';

        $this->registerGetForm($namespace, $route);
        $this->registerPostForm($namespace, $route);
    }

    /**
     * Get Request
     *
     * @unreleased
     *
     * @return void
     */
    public function registerGetForm(string $namespace, string $route)
    {
        register_rest_route($namespace, $route, [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                return $this->formBuilderResourceController->view($request);
            },
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'sanitize_callback' => 'absint',
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
    public function registerPostForm(string $namespace, string $route)
    {
        register_rest_route($namespace, $route, [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                return $this->formBuilderResourceController->update($request);
            },
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'sanitize_callback' => 'absint',
                ],
                'blocks' => [
                    'type' => 'string',
                ],
            ],
        ]);
    }
}
