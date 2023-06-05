<?php

namespace Give\Donations\CustomFields\Controllers;

use Give\DonationForms\Models\DonationForm;
use Give\DonationForms\Repositories\DonationFormRepository;
use Give\Donations\CustomFields\Views\DonationDetailsView;
use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Concerns\ShowInAdmin;
use Give\Framework\FieldsAPI\Concerns\StoreAsMeta;

/**
 * TODO: move into donations domain
 * @since 0.1.0
 */
class DonationDetailsController
{
    /**
     * @since 0.1.0
     *
     * @param  int  $donationID
     *
     * @return string
     */
    public function show(int $donationID): string
    {
        /** @var Donation $donation */
        $donation = Donation::find($donationID);

        if (give(DonationFormRepository::class)->isLegacyForm($donation->formId)) {
            return '';
        }

        /** @var DonationForm $form */
        $form = DonationForm::find($donation->formId);

        $fields = array_filter($form->schema()->getFields(), static function ($field) {
            $traits = class_uses($field);
            
            if (in_array(ShowInAdmin::class, $traits, true) && in_array(StoreAsMeta::class, $traits, true)) {
                return $field->shouldShowInAdmin() && !$field->shouldStoreAsDonorMeta();
            }

            return false;
        });

        return (new DonationDetailsView($donation, $fields))->render();
    }
}
