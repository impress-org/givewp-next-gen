<?php

namespace Give\NextGen\DonationForm\FormTemplates\ClassicFormTemplate;

use Give\NextGen\Framework\FormTemplates\FormTemplate;

/**
 * @unreleased
 */
class ClassicFormTemplate extends FormTemplate {
    /**
     * @unreleased
     */
     public static function id(): string
    {
        return 'classic';
    }

    /**
     * @unreleased
     */
    public static function name(): string
    {
        return __('Classic Template', 'give');
    }

    /**
     * @unreleased
     */
    public function css()
    {
       //
    }

    /**
     * @unreleased
     */
    public function js()
    {
        //
    }
}
