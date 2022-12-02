<?php

namespace Give\CustomFields\Controllers;

use Give\CustomFields\Views\DonationDetailsView;
use Give\Donations\Models\Donation;
use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * @unreleased
 */
class DonationDetailsController
{
    /**
     * @unreleased
     *
     * @param int $donationID
     *
     * @return void
     */
    public function __invoke(int $donationID): void
    {
        $donation = Donation::find($donationID);
        $form = DonationForm::find($donation->formId);
        $fields = array_filter($form->schema()->getFields(), function($field) {
            return $field->shouldDisplayInAdmin() && ! $field->shouldStoreAsDonorMeta();
        });
        $view = new DonationDetailsView($donation, $fields);
        echo $view->render();
    }
}
