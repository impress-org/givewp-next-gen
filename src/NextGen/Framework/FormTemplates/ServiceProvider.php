<?php

namespace Give\NextGen\Framework\FormTemplates;

use Give\Helpers\Hooks;
use Give\NextGen\Framework\FormTemplates\Actions\RegisterFormTemplates;
use Give\NextGen\Framework\FormTemplates\Registrars\FormTemplateRegistrar;
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
        give()->singleton(FormTemplateRegistrar::class);
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        $formTemplateRegistrar = give(FormTemplateRegistrar::class);

        Hooks::doAction('givewp_register_form_template', $formTemplateRegistrar);
        Hooks::doAction('givewp_unregister_form_template', $formTemplateRegistrar);
    }
}
