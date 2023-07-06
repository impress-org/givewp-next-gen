<?php

namespace Give\FormMigration;

use Give\FormMigration\Commands\MigrationCommand;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;
use WP_CLI;

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
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            error_reporting( E_ALL & ~E_DEPRECATED );
            WP_CLI::add_command('givewp form:migrate', MigrationCommand::class);
        }
    }
}
