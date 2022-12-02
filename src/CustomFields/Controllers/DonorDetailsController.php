<?php

namespace Give\CustomFields\Controllers;

use Give\CustomFields\Views\DonorDetailsView;
use Give\Donations\Models\Donation;
use Give\Donors\Models\Donor;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give_Donor as LegacyDonor;

class DonorDetailsController
{
    public function __invoke(LegacyDonor $legacyDonor)
    {
        $donor = Donor::find($legacyDonor->id);

        $forms = $this->getUniqueDonationFormsForDonor($donor);

        $fields = array_reduce($forms, function($fields, DonationForm $form) {
            return $fields + $this->getDisplayedDonorMetaFieldsForForm($form);
        }, []);

        $view = new DonorDetailsView($donor, $fields);
        echo $view->render();
    }

    protected function getUniqueDonationFormsForDonor(Donor $donor): array
    {
        $formIds = array_map(function(Donation $donation) {
            return $donation->formId;
        }, $donor->donations);

        return array_map(function($formId) {
            return DonationForm::find($formId);
        }, array_unique($formIds));
    }

    protected function getDisplayedDonorMetaFieldsForForm(DonationForm $form): array
    {
        return array_filter($form->schema()->getFields(), function($field) {
            return $field->shouldDisplayInAdmin() && $field->shouldStoreAsDonorMeta();
        });
    }
}
