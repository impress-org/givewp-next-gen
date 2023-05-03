<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Framework\FieldsAPI\Actions\CreateValidatorFromFormFields;
use Give\Framework\Support\Contracts\Arrayable;
use Give\NextGen\DonationForm\Exceptions\DonationFormFieldErrorsException;
use Give\NextGen\DonationForm\Models\DonationForm;
use WP_Error;

/**
 * @unreleased
 */
class ValidationRouteData implements Arrayable
{
    /**
     * @var array
     */
    private $requestData;
    /**
     * @var int
     */
    public $formId;

    /**
     * Convert data from request into DTO
     *
     * @unreleased
     */
    public static function fromRequest(array $requestData): self
    {
        $self = new static();
        $self->formId = (int)$requestData['formId'];
        $self->requestData = $requestData;

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
    public function validated(): array
    {
        $request = $this->getRequestData();

        /** @var DonationForm $form */
        $form = DonationForm::find($this->formId);

        if (!$form) {
            $this->throwDonationFormFieldErrorsException(['formId' => 'Invalid Form ID, Form not found']);
        }

        $formFields = array_filter($form->schema()->getFields(), static function ($field) use ($request) {
            return array_key_exists($field->getName(), $request);
        });

        $validator = (new CreateValidatorFromFormFields())($formFields, $request);

        if ($validator->fails()) {
            $this->throwDonationFormFieldErrorsException($validator->errors());
        }

        return $validator->validated();
    }

    /**
     * @unreleased
     */
    public function getRequestData(): array
    {
        return $this->requestData;
    }

    /**
     * This loops over an array of errors in the specific FieldAPI format,
     * and converts them into a WP_Error object that is attached to the
     * exception and delivered back to the client via JSON.
     *
     * @unreleased
     *
     * @param  array<string, string>  $errors
     *
     * @throws DonationFormFieldErrorsException
     */
    private function throwDonationFormFieldErrorsException(array $errors)
    {
        $wpError = new WP_Error();

        foreach ($errors as $id => $error) {
            $wpError->add($id, $error);
        }

        throw new DonationFormFieldErrorsException($wpError);
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
