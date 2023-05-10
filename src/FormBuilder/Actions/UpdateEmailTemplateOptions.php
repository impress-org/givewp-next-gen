<?php

namespace Give\FormBuilder\Actions;

/**
 * Update email template options on backwards compatible form meta.
 */
class UpdateEmailTemplateOptions
{
    public function __invoke($formId, $emailTemplateOptions)
    {
        foreach($emailTemplateOptions as $emailType => $templateOptions) {

            $templateOptions['notification'] = $templateOptions['status'];
            unset($templateOptions['status']);

            foreach($templateOptions as $key => $value) {
                give()->form_meta->update_meta($formId, "_give_{$emailType}_{$key}", $value);
            }
        }
    }
}
