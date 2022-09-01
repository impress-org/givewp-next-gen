<?php

namespace Give\NextGen\DonationForm\Blocks\DonationFormBlock;

use Give\NextGen\DonationForm\Actions\GenerateDonationFormViewRouteUrl;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\DataTransferObjects\BlockAttributes;

class Block
{

    /**
     * @unreleased
     *
     * @return void
     */
    public function register()
    {
        register_block_type(
            __DIR__,
            ['render_callback' => [$this, 'render']]
        );
    }

    /**
     * @unreleased
     *
     * @return string|null
     */
    public function render(array $attributes)
    {
        // return early if we're still inside the editor to avoid server side effects
        if (!empty($_REQUEST)) {
            return null;
        }

        $blockAttributes = BlockAttributes::fromArray($attributes);

        if (!$blockAttributes->formId) {
            return null;
        }

        $viewUrl = (new GenerateDonationFormViewRouteUrl())($blockAttributes->formId, $blockAttributes->formTemplateId);

        return "<div style='position: relative;width: 100%;height: 100%;overflow: hidden;margin: 0 auto;padding-top: 100%;'><iframe src='$viewUrl' style='position: absolute;top: 0;left: 0;bottom: 0;right: 0;width: 100%;height: 100%;'></div>";
    }
}
