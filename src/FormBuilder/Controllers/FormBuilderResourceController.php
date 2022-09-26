<?php

namespace Give\FormBuilder\Controllers;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\FieldsAPI\Form;
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

        if ($requiredFieldsError = $this->validateRequiredFields($form->schema())) {
            return rest_ensure_response($requiredFieldsError);
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

        $updatedSettings = json_decode($formBuilderSettings, true);
        $form->settings = array_merge($form->settings ?? [], $updatedSettings);
        $form->title = $updatedSettings['formTitle'];
        $form->blocks = $blocks;

        if ($requiredFieldsError = $this->validateRequiredFields($form->schema())) {
            return rest_ensure_response($requiredFieldsError);
        }

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
    protected function getRequiredFieldNames(): array
    {
        return [
            "amount",
            "name",
            "gatewayId",
        ];
    }

    /**
     * @unreleased
     *
     * @return WP_Error|void
     */
    protected function validateRequiredFields(Form $schema)
    {
        foreach ($this->getRequiredFieldNames() as $requiredFieldName) {
            if (!$schema->getNodeByName($requiredFieldName)) {
                return new WP_Error(404, __("Required field '$requiredFieldName' not found.", 'give'));
            }
        }
    }
}
