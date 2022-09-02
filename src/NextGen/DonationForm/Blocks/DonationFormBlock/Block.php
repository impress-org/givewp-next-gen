<?php

namespace Give\NextGen\DonationForm\Blocks\DonationFormBlock;

use Give\Framework\EnqueueScript;
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

        /**
         * Load embed givewp script to resize iframe
         *
         * @see https://github.com/davidjbradshaw/iframe-resizer
         */
        (new EnqueueScript(
            'givewp-donation-form-embed',
            'build/donationFormEmbed.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ))->loadInFooter()->enqueue();

        $viewUrl = (new GenerateDonationFormViewRouteUrl())($blockAttributes->formId, $blockAttributes->formTemplateId);

        /**
         * Note: iframe-resizer uses querySelectorAll so using a data attribute makes the most sense to target.
         * It will also generate a dynamic ID - so when we have multiple embeds on a page there will be no conflict.
         */
        return "<iframe data-givewp-embed src='$viewUrl'
                style='width: 1px;min-width: 100%;border: 0;'></iframe>";
    }
}
