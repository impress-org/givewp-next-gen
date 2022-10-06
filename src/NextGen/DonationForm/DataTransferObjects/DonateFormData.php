<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\FieldsAPI\Email;
use Give\Framework\FieldsAPI\Field;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Actions\ValidateCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * @unreleased
 */
class DonateFormData
{
    /**
     * @var float
     */
    public $amount;
    /**
     * @var string
     */
    public $gatewayId;
    /**
     * @var string
     */
    public $currency;
    /**
     * @var string
     */
    public $firstName;
    /**
     * @var string
     */
    public $lastName;
    /**
     * @var string
     */
    public $email;
    /**
     * @var int
     */
    public $wpUserId;
    /**
     * @var int
     */
    public $formId;
    /**
     * @var string
     */
    public $formTitle;
    /**
     * @var string|null
     */
    public $company;
    /**
     * @var string|null
     */
    public $honorific;
    /**
     * @var array
     */
    public $customFields;
    /**
     * @var array
     */
    private $request;

    /**
     * Convert data from request into DTO
     *
     * @unreleased
     *
     * @param  array  $request
     * @return DonateFormData
     */
    public static function fromRequest(array $request): DonateFormData
    {
        $self = new static();
        $self->customFields = $request['customFields'];
        unset($request['customFields']);

        $self->request = array_merge($request, $self->customFields);
        $self->gatewayId = $request['gatewayId'];
        $self->amount = $request['amount'];
        $self->currency = $request['currency'];
        $self->firstName = $request['firstName'];
        $self->lastName = $request['lastName'];
        $self->email = $request['email'];
        $self->wpUserId = get_current_user_id();
        $self->formId = (int)$request['formId'];
        $self->formTitle = get_the_title($request['formId']);
        $self->company = !empty($request['company']) ? $request['company'] : null;
        $self->honorific = !empty($request['honorific']) ? $request['honorific'] : null;

        return $self;
    }

    /**
     * @unreleased
     */
    public function toDonation($donorId): Donation
    {
        return new Donation([
            'status' => DonationStatus::PENDING(),
            'gatewayId' => $this->gatewayId,
            'amount' => Money::fromDecimal($this->amount, $this->currency),
            'donorId' => $donorId,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'formId' => $this->formId,
            'formTitle' => $this->formTitle,
            'company' => $this->company
        ]);
    }

    /**
     * @unreleased
     *
     * @throws InvalidArgumentException
     *
     * @return void
     */
    public function validateCustomFields()
    {
        if (!empty($this->customFields)) {
            (new ValidateCustomFields())($this->getDonationForm(), $this->customFields);
        }
    }

    /**
     * @unreleased
     */
    public function validateFields(): array
    {
        $request = $this->getRequest();

        $errors = [];

        $this->getDonationForm()->schema()->walkFields(static function (Field $field) use (
            $request,
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
        });

        return $errors;
    }

    /**
     * @unreleased
     */
    public function getDonationForm(): DonationForm
    {
        return DonationForm::find($this->formId);
    }

    /**
     * @unreleased
     */
    public function getRequest(): array
    {
        return $this->request;
    }
}
