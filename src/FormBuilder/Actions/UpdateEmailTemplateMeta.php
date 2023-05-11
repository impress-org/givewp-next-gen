<?php

namespace Give\FormBuilder\Actions;

/**
 * Update email template options on backwards compatible form meta.
 */
class UpdateEmailTemplateMeta
{
    public function __invoke($form)
    {
        foreach($form->settings->emailTemplateOptions as $emailType => $templateOptions) {

            $templateOptions['notification'] = $templateOptions['status'];
            unset($templateOptions['status']);

            foreach($templateOptions as $key => $value) {
                give()->form_meta->update_meta($form->id, "_give_{$emailType}_{$key}", $value);
            }
        }
    }
}
