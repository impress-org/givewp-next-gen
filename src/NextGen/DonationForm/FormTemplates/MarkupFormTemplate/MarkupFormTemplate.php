<?php

namespace Give\NextGen\DonationForm\FormTemplates\MarkupFormTemplate;

use Give\NextGen\Framework\FormTemplates\FormTemplate;

/**
 * @unreleased
 */
class MarkupFormTemplate extends FormTemplate {
    /**
     * @unreleased
     */
     public static function id(): string
    {
        return 'markup';
    }

    /**
     * @unreleased
     */
    public static function name(): string
    {
        return __('Markup Template', 'give');
    }

    /**
     * @unreleased
     */
    public function css(): string
    {
        return GIVE_NEXT_GEN_URL . 'build/markupTemplateCss.css';
    }

    /**
     * @unreleased
     */
    public function js(): string
    {
        return GIVE_NEXT_GEN_URL . 'build/markupTemplateJs.js';
    }

    /**
     * @unreleased
     */
    public function dependencies(): array
    {
        $scriptAsset = require GIVE_NEXT_GEN_DIR . 'build/markupTemplateJs.asset.php';

        return $scriptAsset['dependencies'];
    }
}
