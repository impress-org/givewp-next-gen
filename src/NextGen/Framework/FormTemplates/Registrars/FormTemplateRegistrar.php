<?php

namespace Give\NextGen\Framework\FormTemplates\Registrars;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\PaymentGateways\Exceptions\OverflowException;
use Give\NextGen\Framework\FormTemplates\FormTemplate;

/**
 * @unreleased
 */
class FormTemplateRegistrar
{
    protected $templates = [];

    /**
     * @unreleased
     */
    public function getTemplates(): array
    {
        return $this->templates;
    }

    /**
     * @unreleased
     *
     * @throws InvalidArgumentException
     */
    public function getTemplate(string $id): FormTemplate
    {
        if (!$this->hasTemplate($id)) {
            throw new InvalidArgumentException("No template exists with the ID {$id}");
        }

        /** @var FormTemplate $template */
        $template = give($this->templates[$id]);

        return $template;
    }

    /**
     * @unreleased
     */
    public function hasTemplate(string $id): bool
    {
        return isset($this->templates[$id]);
    }

    /**
     * @unreleased
     *
     * @throws OverflowException|InvalidArgumentException|Exception
     */
    public function registerTemplate(string $templateClass)
    {
        if (!is_subclass_of($templateClass, FormTemplate::class)) {
            throw new InvalidArgumentException(
                sprintf(
                    '%1$s must extend %2$s',
                    $templateClass,
                    FormTemplate::class
                )
            );
        }

        $templateId = $templateClass::id();

        if ($this->hasTemplate($templateId)) {
            throw new OverflowException("Cannot register a template with an id that already exists: $templateId");
        }

        $this->templates[$templateId] = $templateClass;

        give()->singleton($templateClass);
    }

    /**
     * @unreleased
     */
    public function unregisterTemplate(string $templateId)
    {
        if (isset($this->templates[$templateId])) {
            unset($this->templates[$templateId]);
        }
    }
}
