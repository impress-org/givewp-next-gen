<?php

namespace Give\FormMigration\Steps\FormTemplate;

use Give\FormMigration\Contracts\FormMigrationStep;

class SequoiaTemplateSettings extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return 'sequoia' === $this->formV2->getFormTemplate();
    }

    public function process()
    {
        [
            'visual_appearance' => $visualAppearance,
            'introduction' => $introduction,
            'payment_amount' => $paymentAmount,
            'payment_information' => $paymentInformation,
            'thank-you' => $thankYou,
        ] = $this->formV2->getFormTemplateSettings();
    }
}
