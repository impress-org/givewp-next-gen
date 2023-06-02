<?php

namespace Give\CustomFields\Controllers;

use Give\CustomFields\Views\DonationDetailsView;
use Give\DonationForm\Models\DonationForm;
use Give\DonationForm\Repositories\DonationFormRepository;
use Give\Donations\Models\Donation;

/**
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
            return $field->shouldDisplayInAdmin() && !$field->shouldStoreAsDonorMeta();
        });

        return (new DonationDetailsView($donation, $fields))->render();
    }
}
