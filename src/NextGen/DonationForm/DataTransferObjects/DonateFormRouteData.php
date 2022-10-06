<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Framework\FieldsAPI\Email;
use Give\Framework\FieldsAPI\Field;
use Give\Log\Log;
use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * @unreleased
 */
class DonateFormRouteData
{
    /**
     * @var string
     */
    public $gatewayId;
    /**
     * @var array
     */
    private $request;
    /**
     * @var int
     */
    public $formId;

    /**
     * Convert data from request into DTO
     *
     * @unreleased
     */
    public static function fromRequest(array $request): DonateFormRouteData
    {
        $self = new static();
        $self->formId = (int)$request['formId'];
        $self->gatewayId = $request['gatewayId'];
        $self->request = $request;

        return $self;
    }

    /**
     * @unreleased
     */
    public function validateFields(): DonateControllerData
    {
        $request = $this->getRequest();

        $validData = new DonateControllerData();

        $errors = [];

        /** @var DonationForm $form */
        $form = DonationForm::find($this->formId);

        $form->schema()->walkFields(function (Field $field) use (
            $request,
            $validData,
            &$errors
        ) {
            $fieldValue = $request[$field->getName()];

            // validate specific field types
            if ($field->getType() === Email::TYPE && !is_email($fieldValue)) {
                $error = $request[$field->getName()] = [
                    'error_id' => $field->getName(),
                    'error_message' => sprintf(
                        esc_html__('Please use a valid email for %s', 'give'),
                        $field->getName()
                    ),
                ];

                $errors[] = $error;
            }

            // validate required fields
            if (empty($fieldValue) && $field->isRequired()) {
                $errors[] = $request[$field->getName()] = $field->getRequiredError();
            }

            if (empty($errors[$field->getName()])) {
                $validData->{$field->getName()} = $this->castFieldValue($field, $fieldValue);
            }
        });

        if ($errors) {
            // TODO: throw exception and elevate error handling
            Log::error('DonationFormErrors', compact('errors'));

            $this->redirectWithErrors($errors);
        }

        $validData->wpUserId = get_current_user_id();

        return $validData;
    }

    /**
     * @unreleased
     */
    public function getRequest(): array
    {
        return $this->request;
    }

    /**
     * @unreleased
     */
    private function redirectWithErrors(array $errors)
    {
        $wpError = new \WP_Error();

        foreach ($errors as $error) {
            $wpError->add($error['error_id'], $error['error_message']);
        }

        wp_send_json_error(['errors' => $wpError]);
    }

    /**
     * @unreleased
     */
    private function castFieldValue(Field $field, string $fieldValue)
    {
        if ($field->getName() === 'formId') {
            return (int)$fieldValue;
        }

        return $fieldValue;
    }
}
