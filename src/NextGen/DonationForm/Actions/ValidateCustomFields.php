<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\FieldsAPI\Text;
use Give\NextGen\DonationForm\Models\DonationForm;

class ValidateCustomFields {
    /**
     * In order to store custom fields, we need to validate them by comparing the form's
     * schema settings to the request.
     *
     * @unreleased
     *
     * @return void
     */
    public function __invoke(DonationForm $form, array $customFields)
    {
        $formSchema = $form->schema();

        foreach ($customFields as $key => $value) {
            /** @var Text $node */
            $node = $formSchema->getNodeByName($key);

            // make sure node exists in schema
            if (!$node) {
                throw new InvalidArgumentException("$key is not a valid custom field.");
            }

            if (empty($value) && $node->isRequired()) {
                throw new InvalidArgumentException("$key is required.");
            }
        }
    }
}
