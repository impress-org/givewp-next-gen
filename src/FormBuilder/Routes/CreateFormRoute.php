<?php

namespace Give\FormBuilder\Routes;

use Exception;
use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * Route to create a new form
 */
class CreateFormRoute
{
    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function __invoke()
    {
        if (isset($_GET['page']) && 'campaign-builder' === $_GET['page']) {
            // Little hack for alpha users to make sure the form builder is loaded.
            if (!isset($_GET['donationFormID'])) {
                wp_redirect('edit.php?post_type=give_forms&page=campaign-builder&donationFormID=new');
                exit();
            }
            if ('new' === $_GET['donationFormID']) {
                $form = DonationForm::factory()->create();

                wp_redirect('edit.php?post_type=give_forms&page=campaign-builder&donationFormID=' . $form->id);
                exit();
            }
        }
    }
}
