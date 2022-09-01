<?php

namespace Give\NextGen\DonationForm\Blocks\DonationFormBlock;

use Give\Framework\EnqueueScript;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\DataTransferObjects\BlockAttributes;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ViewModels\DonationFormViewModel;
use Give\NextGen\Framework\FormTemplates\Registrars\FormTemplateRegistrar;

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

        //$viewUrl = (new GenerateDonationFormViewRouteUrl())($blockAttributes->formId);

        //return "<iframe src='$viewUrl'>";

        $viewModel = new DonationFormViewModel($blockAttributes);

        $exports = $viewModel->exports();

        ob_start();
        ?>

        <script>window.giveNextGenExports = <?= wp_json_encode($exports) ?>;</script>

        <?php
        $this->enqueueScripts($blockAttributes->formId, $blockAttributes->formTemplateId);
        ?>

        <div id="root-give-next-gen-donation-form-block"></div>

        <?php
        return ob_get_clean();
    }

    /**
     * Loads scripts in order: [Registrars, Template, Gateways, Block]
     *
     * @unreleased
     *
     * @return void
     */
    private function enqueueScripts(int $formId, string $formTemplateId)
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        // load registrars
        (new EnqueueScript(
            'give-donation-form-registrars-js',
            'build/donationFormRegistrars.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ))->loadInFooter()->enqueue();

        // load template
        /** @var FormTemplateRegistrar $formTemplateRegistrar */
        $formTemplateRegistrar = give(FormTemplateRegistrar::class);

        // silently fail if template is missing for some reason
        if ($formTemplateRegistrar->hasTemplate($formTemplateId)) {
            $template = $formTemplateRegistrar->getTemplate($formTemplateId);

            if ($template->css()) {
                wp_enqueue_style('givewp-form-template-' . $template->getId(), $template->css());
            }

            if ($template->js()) {
                wp_enqueue_script(
                    'givewp-form-template-' . $template->getId(),
                    $template->js(),
                    array_merge(
                        ['give-donation-form-registrars-js'],
                        $template->dependencies()
                    ),
                    false,
                    true
                );
            }
        }

        // load gateways
        foreach ($donationFormRepository->getEnabledPaymentGateways($formId) as $gateway) {
            if (method_exists($gateway, 'enqueueScript')) {
                /** @var EnqueueScript $script */
                $script = $gateway->enqueueScript();

                $script->dependencies(['give-donation-form-registrars-js'])
                    ->loadInFooter()
                    ->enqueue();
            }
        }

        // load block - since this is using render_callback viewScript in blocks.json will not work.
        (new EnqueueScript(
            'give-next-gen-donation-form-block-js',
            'build/donationFormBlockApp.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ))->dependencies(['give-donation-form-registrars-js'])->loadInFooter()->enqueue();
    }
}
