<?php

namespace Give\DonationForms\Listeners;

use Give\DonationForms\Models\DonationForm;
use Give\Donations\Models\Donation;
use Give\Form\LegacyConsumer\Actions\UploadFilesAction;
use Give\Framework\FieldsAPI\Field;
use Give\Framework\FieldsAPI\File;
use Give\Framework\FieldsAPI\Types;

class StoreCustomFields
{
    /**
     * In order to store custom fields, we need to validate them by comparing the form's
     * schema settings to the request.  Once a field has passed validation, we can determine
     * its storage location from the fields api.  This Action is designed to be triggered post-validation.
     *
     * @unreleased add support for file fields
     * @since 0.1.0
     *
     * @return void
     */
    public function __invoke(DonationForm $form, Donation $donation, array $customFields)
    {
        $form->schema()->walkFields(
            function (Field $field) use ($customFields, $donation) {
                $fieldName = $field->getName();
                $fieldType = $field->getType();

                if (!array_key_exists($fieldName, $customFields)) {
                    return;
                }

                /** @var File $field */
                if (($fieldType === Types::FILE) && isset($_FILES[$fieldName])) {
                    //TODO: let file field provide this storage logic
                    $this->handleFileUpload($field, $donation);
                } else {
                    $value = $customFields[$fieldName];

                    $this->handleMetaStorage($field, $donation, $value);
                }
            }
        );
    }

    /**
     * @unreleased
     */
    protected function handleFileUpload(File $field, Donation $donation)
    {
        $fileUploader = new UploadFilesAction($field);
        $fileIds = $fileUploader();

        foreach ($fileIds as $fileId) {
            $this->handleMetaStorage($field, $donation, $fileId);
        }
    }

    /**
     * @unreleased
     */
    protected function handleMetaStorage(Field $field, Donation $donation, $value)
    {
        if ($field->shouldStoreAsDonorMeta()) {
            // save as donor meta
            give()->donor_meta->update_meta($donation->donorId, $field->getName(), $value);
        } else {
            // save as donation meta
            give()->payment_meta->update_meta($donation->id, $field->getName(), $value);
        }
    }
}
