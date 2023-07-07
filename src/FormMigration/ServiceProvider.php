<?php

namespace Give\FormMigration;

use Give\FormMigration\Commands\MigrationCommand;
use Give\FormMigration\Controllers\MigrationController;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;
use WP_CLI;
use WP_REST_Server;

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
        give()->singleton(Pipeline::class, function() {
            return new Pipeline([
                Steps\FormTemplate\ClassicTemplateSettings::class,
                Steps\FormTemplate\SequoiaTemplateSettings::class,
                Steps\FormTemplate\LegacyTemplateSettings::class,
                Steps\DonationOptions::class,
                Steps\FormFields::class
            ]);
        });
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        $this->registerRoutes();
        $this->registerCommands();
    }

    protected function registerRoutes()
    {
        add_action('rest_api_init', function() {
            register_rest_route('givewp/v3', '/migrate/(?P<id>\d+)', [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => new MigrationController(),
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
        });
    }

    protected function registerCommands()
    {
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            error_reporting( E_ALL & ~E_DEPRECATED );
            WP_CLI::add_command('givewp form:migrate', MigrationCommand::class);
        }
    }
}
