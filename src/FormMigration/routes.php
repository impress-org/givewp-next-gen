<?php

register_rest_route('givewp/v3', '/migrate/(?P<id>\d+)', [
    'methods' => WP_REST_Server::CREATABLE,
    'callback' => new \Give\FormMigration\Controllers\MigrationController(),
    'permission_callback' => function () {
        return current_user_can('manage_options');
    },
    'args' => [
        'id' => [
            'type' => 'integer',
            'sanitize_callback' => 'absint',
            'description' => __('The ID of the form (v2) to migrate to v3.', 'givewp'),
        ],
    ],
]);
