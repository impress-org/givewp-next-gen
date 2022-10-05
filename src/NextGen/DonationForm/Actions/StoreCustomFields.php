<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Donations\Models\Donation;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\NextGen\DonationForm\Models\DonationForm;

class StoreCustomFields {
    /**
     *
     *
     * @unreleased
     *
     * @return void
     */
    public function __invoke(DonationForm $form, Donation $donation, array $customFields)
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

            if ($node->shouldStoreAsDonorMeta()) {
                // save as donor meta
                give()->donor_meta->add_meta($donation->donorId, $node->getName(), $value);
            } else {
                // save as donation meta
                give()->payment_meta->update_meta($donation->id, $node->getName(), $value);
            }
        }
    }
}
