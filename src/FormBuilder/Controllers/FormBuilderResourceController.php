<?php

namespace Give\FormBuilder\Controllers;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Request;
use WP_REST_Response;

class FormBuilderResourceController
{
    /**
     * Get the form builder instance
     *
     * @unreleased
     *
     * @param  WP_REST_Request  $request
     * @return WP_Error|WP_HTTP_Response|WP_REST_Response
     */
    public function show(WP_REST_Request $request)
    {
        $formId = $request->get_param('id');

        /** @var DonationForm $form */
        $form = DonationForm::find($formId);

        if (!$form) {
            return rest_ensure_response(new WP_Error(404, 'Form not found.'));
        }

        if ($blockError = $this->validateBlocks($form->blocks)) {
            return rest_ensure_response($blockError);
        }

        return rest_ensure_response([
            'blocks' => $form->blocks->toJson(),
            'settings' => json_encode($form->settings)
        ]);
    }

    /**
     * Update the form builder
     *
     * @unreleased
     *
     * @return WP_Error|WP_HTTP_Response|WP_REST_Response
     * @throws Exception
     */
    public function update(WP_REST_Request $request)
    {
        $formId = $request->get_param('id');
        $formBuilderSettings = $request->get_param('settings');
        $rawBlocks = $request->get_param('blocks');

        /** @var DonationForm $form */
        $form = DonationForm::find($formId);

        if (!$form) {
            return rest_ensure_response(new WP_Error(404, __('Form not found.', 'give')));
        }

        $blocks = BlockCollection::fromJson($rawBlocks);

        if ($blockError = $this->validateBlocks($blocks)) {
            return rest_ensure_response($blockError);
        }

        $updatedSettings = json_decode($formBuilderSettings, true);
        $form->settings = array_merge($form->settings ?? [], $updatedSettings);
        $form->title = $updatedSettings['formTitle'];
        $form->blocks = $blocks;
        $form->save();

        return rest_ensure_response([
            'settings' => json_encode($form->settings),
            'form' => $form->id,
        ]);
    }

    /**
     * @unreleased
     *
     * @return string[]
     */
    protected function getRequiredBlockNames(): array
    {
        return [
            "custom-block-editor/donation-amount",
            "custom-block-editor/donor-info",
            "custom-block-editor/payment-details",
        ];
    }

    /**
     * @unreleased
     *
     * @return WP_Error|void
     */
    protected function validateBlocks(BlockCollection $blocks)
    {
        $blockNames = array_column($blocks->toArray(), 'name');

        foreach ($this->getRequiredBlockNames() as $requiredBlock) {
            if (!in_array($requiredBlock, $blockNames, true)) {
                return new WP_Error(404, __("Required block $requiredBlock not found.", 'give'));
            }
        }
    }
}
