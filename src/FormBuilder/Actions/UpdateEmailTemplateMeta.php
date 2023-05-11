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

            if(isset($templateOptions['recipient'])) {
                $templateOptions['recipient'] = $this->formatRecipientEmails($templateOptions['recipient']);
            }

            foreach($templateOptions as $key => $value) {
                give()->form_meta->update_meta($form->id, "_give_{$emailType}_{$key}", $value);
            }
        }
    }

    protected function formatRecipientEmails($emails)
    {
        return array_map(function($email) {
            return ['email' => $email];
        }, $emails);
    }
}
