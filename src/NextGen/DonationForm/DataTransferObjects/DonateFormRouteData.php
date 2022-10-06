<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Framework\FieldsAPI\Email;
use Give\Framework\FieldsAPI\Field;
use Give\NextGen\DonationForm\Exceptions\DonationFormFieldErrorsException;
use Give\NextGen\DonationForm\Models\DonationForm;
use WP_Error;

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
     * This method loops over the form schema to
     * compares the request against the individual fields,
     * their types and validation rules.
     *
     * @unreleased
     *
     * @throws DonationFormFieldErrorsException
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

            // validate specific field types like email
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
                $validData->{$field->getName()} = $this->castFieldValue($field, $fieldValue ?? '');
            }
        });

        if ($errors) {
            $this->throwDonationFormFieldErrorsException($errors);
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
     * @throws DonationFormFieldErrorsException
     */
    private function throwDonationFormFieldErrorsException(array $errors)
    {
        $wpError = new WP_Error();

        foreach ($errors as $error) {
            $wpError->add($error['error_id'], $error['error_message']);
        }

        $exception = new DonationFormFieldErrorsException();
        $exception->setError($wpError);

        throw $exception;
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
