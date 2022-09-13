<?php

namespace Give\FormBuilder\Routes;
use Give\Addon\View;
use Give\Framework\EnqueueScript;

/**
 * Add form builder page route and scripts
 */
class RegisterFormBuilderPageRoute
{
    /**
     * Use add_submenu_page to register page within WP admin
     *
     * @unreleased
     *
     * @return void
     */
    public function __invoke()
    {
        add_submenu_page(
            'edit.php?post_type=give_forms',
            __('Visual Builder <span class="awaiting-mod">Alpha</span>', 'givewp'),
            __('Visual Builder <span class="awaiting-mod">Alpha</span>', 'givewp'),
            'manage_options',
            'campaign-builder',
            [$this, 'renderPage'],
            1
        );
    }

    /**
     * Render page with scripts
     *
     * @unreleased
     *
     * @return void
     */
    public function renderPage()
    {
        [$css, $js] = $this->getAssetManifest();

        $formBuilderStorage = (new EnqueueScript(
            '@givewp/form-builder/storage',
            'src/FormBuilder/resources/js/storage.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ));

        $formBuilderStorage->registerLocalizeData('storageData', [
            'resourceURL' => rest_url('givewp/next-gen/form/' . abs($_GET['donationFormID'])),
            'nonce' => wp_create_nonce('wp_rest'),
            'blockData' => get_post(abs($_GET['donationFormID']))->post_content,
            'settings' => get_post_meta(abs($_GET['donationFormID']), 'formBuilderSettings', true),
            'currency' => give_get_currency(),
        ]);

        $formBuilderStorage->loadInFooter()->enqueue();

        (new EnqueueScript(
            '@givewp/form-builder/script',
            'packages/form-builder/build/' . $js,
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ))->loadInFooter()->enqueue();

        wp_add_inline_script(
            '@givewp/form-builder/script',
            "
                        document.getElementById('app').attachShadow({mode: 'open'})
                            .appendChild( document.getElementById('root') )
                            .appendChild( document.getElementById('shadowDomStyles') )
                    "
        );

        View::render('FormBuilder.admin-form-builder', [
            'shadowDomStyles' => file_get_contents(
                trailingslashit(GIVE_NEXT_GEN_DIR) . 'packages/form-builder/build/' . $css
            ),
        ]);
    }

    /**
     * Get css and js paths from manifest file
     *
     * @unreleased
     */
    public function getAssetManifest(): array
    {
        return json_decode(
            file_get_contents(GIVE_NEXT_GEN_DIR . 'packages/form-builder/build/asset-manifest.json'),
            false
        )->entrypoints;
    }
}
