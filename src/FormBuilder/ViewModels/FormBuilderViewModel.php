<?php

namespace Give\FormBuilder\ViewModels;

class FormBuilderViewModel
{
    /**
     * @unreleased
     *
     * @return array
     */
    public function storageData(): array
    {
        $donationFormId = abs($_GET['donationFormID']);

        return [
            'resourceURL' => rest_url('givewp/next-gen/form/' . $donationFormId),
            'nonce' => wp_create_nonce('wp_rest'),
            'blockData' => get_post($donationFormId)->post_content,
            'settings' => get_post_meta($donationFormId, 'formBuilderSettings', true),
            'currency' => give_get_currency(),
        ];
    }

    /**
     * @unreleased
     */
    public function shadowDomStyles(): string
    {
        return file_get_contents(trailingslashit(GIVE_NEXT_GEN_DIR) . 'packages/form-builder/build/' . $this->css());
    }

    /**
     * @unreleased
     */
    public function attachShadowScript(): string
    {
        return "document.getElementById('app').attachShadow({mode: 'open'}).appendChild( document.getElementById('root') ).appendChild( document.getElementById('shadowDomStyles') )";
    }

    /**
     * Get manifest file
     *
     * @unreleased
     */
    protected function getAssetManifest()
    {
        return json_decode(
            file_get_contents(GIVE_NEXT_GEN_DIR . 'packages/form-builder/build/asset-manifest.json'),
            false
        );
    }

    /**
     * Get main css path
     *
     * @unreleased
     */
    public function css(): string
    {
        return $this->getAssetManifest()->files->{"main.css"};
    }

    /**
     * Get main js path
     *
     * @unreleased
     */
    public function js(): string
    {
        return $this->getAssetManifest()->files->{"main.js"};
    }
}
