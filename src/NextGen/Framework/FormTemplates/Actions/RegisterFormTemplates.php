<?php

namespace Give\NextGen\Framework\FormTemplates\Actions;

use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Helpers\Hooks;
use Give\NextGen\DonationForm\FormTemplates\ClassicFormTemplate\ClassicFormTemplate;
use Give\NextGen\Framework\FormTemplates\Registrars\FormTemplateRegistrar;

class RegisterFormTemplates
{
    /**
     * Array of FormTemplate classes to be bootstrapped
     *
     * @var string[]
     */
    public $templates = [
        ClassicFormTemplate::class
    ];

    /**
     * Registers all the form templates with GiveWP
     *
     * @unreleased
     *
     * @return void
     *
     * @throws InvalidArgumentException
     */
    public function __invoke()
    {
        /** @var FormTemplateRegistrar $formTemplateRegistrar */
        $formTemplateRegistrar = give(FormTemplateRegistrar::class);

        foreach ($this->templates as $template) {
            $formTemplateRegistrar->registerTemplate($template);
        }

        Hooks::doAction('givewp_register_form_template', $formTemplateRegistrar);
        Hooks::doAction('givewp_unregister_form_template', $formTemplateRegistrar);
    }
}
