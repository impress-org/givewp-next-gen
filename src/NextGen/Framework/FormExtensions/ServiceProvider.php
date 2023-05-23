<?php

namespace Give\NextGen\Framework\FormExtensions;

use Give\Helpers\Hooks;
use Give\NextGen\Framework\FormExtensions\Registrars\FormExtensionRegistrar;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @unreleased
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
        give()->singleton(FormExtensionRegistrar::class);
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        $registrar = give()->make(FormExtensionRegistrar::class);

        Hooks::doAction('givewp_register_form_extension', $registrar);
        Hooks::doAction('givewp_unregister_form_extension', $registrar);
    }
}
