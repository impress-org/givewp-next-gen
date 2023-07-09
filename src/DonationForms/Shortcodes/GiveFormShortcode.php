<?php

namespace Give\DonationForms\Shortcodes;

use Give\DonationForms\Blocks\DonationFormBlock\Controllers\BlockRenderController;

class GiveFormShortcode
{
    /**
     * @unreleased
     */
    public function __invoke(string $output, array $atts): string
    {
        $formId = absint($atts['id']);
        $isV3Form = (bool) give()->form_meta->get_meta($formId, 'formBuilderSettings', true);

        if (!$isV3Form) {
            return $output;
        }

        $controller = new BlockRenderController();
        $blockAttributes = [
            'formId' => $formId,
            'blockId' => 'give-form-shortcode-' . uniqid(),
        ];

        return $controller->render($blockAttributes);
    }
}
