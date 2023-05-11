<?php

namespace Give\FormBuilder\Actions;

use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * Update email settings on backwards compatible form meta.
 */
class UpdateEmailSettingsMeta
{
    public function __invoke(DonationForm $form)
    {
        give()->form_meta->update_meta($form->id, "_give_email_options", $form->settings->emailOptionsStatus);
        give()->form_meta->update_meta($form->id, "_give_email_template", $form->settings->emailTemplate);
        give()->form_meta->update_meta($form->id, "_give_email_logo", $form->settings->emailLogo);
        give()->form_meta->update_meta($form->id, "_give_from_name", $form->settings->emailFromName);
        give()->form_meta->update_meta($form->id, "_give_from_email", $form->settings->emailFromEmail);
    }
}
