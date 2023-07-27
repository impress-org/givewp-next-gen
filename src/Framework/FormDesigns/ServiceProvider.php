<?php

namespace Give\Framework\FormDesigns;

use Give\Framework\FormDesigns\Actions\RegisterFormDesigns;
use Give\Framework\FormDesigns\Registrars\FormDesignRegistrar;
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
        give()->singleton(FormDesignRegistrar::class, function () {
            return new FormDesignRegistrar();
        });
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        $registrar = give()->make(FormDesignRegistrar::class);

        do_action('givewp_register_form_design', $registrar);
        do_action('givewp_unregister_form_design', $registrar);
    }
}
