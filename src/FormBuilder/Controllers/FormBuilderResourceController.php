<?php

namespace Give\FormBuilder\Controllers;

use WP_REST_Request;

class  FormBuilderResourceController
{
    /**
     * Get the form builder instance
     *
     * TODO: replace logic with form model
     *
     * @unreleased
     */
    public function view(WP_REST_Request $request): array
    {
        $formId = $request->get_param('id');
        $formData = get_post($formId)->post_content;
        $formBuilderSettings = get_post_meta($formId, 'formBuilderSettings', true);

        return [
            'blocks' => $formData,
            'settings' => $formBuilderSettings
        ];
    }

    /**
     * Update the form builder
     *
     * TODO: replace logic with form model
     *
     * @unreleased
     */
    public function update(WP_REST_Request $request): array
    {
        $formId = $request->get_param('id');
        $formBuilderSettings = $request->get_param('settings');
        $data = $request->get_param('blocks');

        $meta = update_post_meta($formId, 'formBuilderSettings', $formBuilderSettings);

        $post = wp_update_post([
            'ID' => $formId,
            'post_content' => $data,
            'post_title' => json_decode($formBuilderSettings, false)->formTitle,
        ]);

        return [
            $meta,
            $post,
        ];
    }
}
