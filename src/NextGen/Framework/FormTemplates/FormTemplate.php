<?php

namespace Give\NextGen\Framework\FormTemplates;

use Give\NextGen\Framework\FormTemplates\Contracts\FormTemplateInterface;

/**
 * @unreleased
 */
abstract class FormTemplate implements FormTemplateInterface {
    /**
     * @unreleased
     */
    abstract public static function id(): string;

    /**
     * @unreleased
     */
    abstract public static function name(): string;

    /**
     * @unreleased
     */
    public function getId(): string
    {
        return self::id();
    }

    /**
     * @unreleased
     */
    public function getName(): string
    {
        return self::name();
    }
}
