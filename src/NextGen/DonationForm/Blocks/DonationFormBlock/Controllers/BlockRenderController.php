<?php

namespace Give\NextGen\DonationForm\Blocks\DonationFormBlock\Controllers;

use Give\Framework\EnqueueScript;
use Give\NextGen\DonationForm\Actions\GenerateDonationConfirmationReceiptViewRouteUrl;
use Give\NextGen\DonationForm\Actions\GenerateDonationFormViewRouteUrl;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\DataTransferObjects\BlockAttributes;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Routes\RouteListener;

class BlockRenderController
{
    /**
     * @unreleased
     *
     * @return string|null
     */
    public function render(array $attributes)
    {
        // return early if we're still inside the editor to avoid server side effects
        if (!empty($_REQUEST['post']) || !empty($_REQUEST['action']) || !empty($_REQUEST['_locale'])) {
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

        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($blockAttributes->formId);

        $viewUrl = (new GenerateDonationFormViewRouteUrl())($donationForm->id);
        $embedId = $blockAttributes->blockId;

        if ($this->shouldDisplayDonationConfirmationReceipt($embedId)) {
            $receiptId = give_clean($_GET['givewp-receipt-id']);

            $viewUrl = (new GenerateDonationConfirmationReceiptViewRouteUrl())($receiptId);
        }

        /**
         * Note: iframe-resizer uses querySelectorAll so using a data attribute makes the most sense to target.
         * It will also generate a dynamic ID - so when we have multiple embeds on a page there will be no conflict.
         */
        return "<iframe data-givewp-embed src='$viewUrl' data-givewp-embed-id='$embedId' style='width: 1px;min-width: 100%;border: 0;'></iframe>";
    }

    /**
     * @unreleased
     */
    protected function shouldDisplayDonationConfirmationReceipt(string $embedId): bool
    {
        $routeListener = new RouteListener(
            'donation-completed',
            'show-donation-confirmation-receipt'
        );

        return $routeListener->isValid($_GET, function ($request) use ($embedId) {
            $isset = isset($request['givewp-embed-id'], $request['givewp-receipt-id']);
            
            return $isset && $request['givewp-embed-id'] === $embedId && strlen($request['givewp-receipt-id']) === 32;
        });
    }
}
