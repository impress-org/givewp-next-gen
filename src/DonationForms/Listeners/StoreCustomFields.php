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
     * @unreleased added support for field scopes and file uploads
     * @since 0.1.0
     *
     * @return void
     */
    public function __invoke(DonationForm $form, Donation $donation, array $customFields)
    {
        $form->schema()->walkFields(
            function (Field $field) use ($customFields, $donation) {
                $fieldName = $field->getName();

                if (!array_key_exists($fieldName, $customFields)) {
                    return;
                }

                $value = $customFields[$fieldName];

                if (isset($_FILES[$fieldName]) && ($field->getType() === Types::FILE || $field->getScope()->isFile())) {
                    /** @var File $field */
                    $this->handleFileUpload($field, $donation);
                } elseif ($field->getScope()->isDonor()) {
                    $this->storeAsDonorMeta($donation->donorId, $field->getMetaKey() ?? $field->getName(), $value);
                } elseif ($field->getScope()->isDonation()) {
                    $this->storeAsDonationMeta($donation->id, $field->getMetaKey() ?? $field->getName(), $value);
                } elseif ($field->getScope()->isCallback()) {
                    $field->getScopeCallback()($field, $value, $donation);
                } else {
                    do_action(
                        "givewp_donation_form_persist_field_scope_{$field->getScopeValue()}",
                        $field,
                        $value,
                        $donation
                    );
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
            if ($field->shouldStoreAsDonorMeta()) {
                $this->storeAsDonorMeta($donation->donorId, $field->getMetaKey() ?? $field->getName(), $fileId);
            } else {
                $this->storeAsDonationMeta($donation->id, $field->getMetaKey() ?? $field->getName(), $fileId);
            }
        }
    }

    /**
     * @unreleased
     */
    protected function storeAsDonorMeta(int $donorId, string $metaKey, $value)
    {
        give()->donor_meta->update_meta($donorId, $metaKey, $value);
    }

    /**
     * @unreleased
     */
    protected function storeAsDonationMeta(int $donationId, string $metaKey, $value)
    {
        give()->payment_meta->update_meta($donationId, $metaKey, $value);
    }
}
