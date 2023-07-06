<?php

namespace Give\FormMigration\Steps\FormTemplate;

use Give\FormMigration\Contracts\FormMigrationStep;

class ClassicTemplateSettings extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return 'classic' === $this->formV2->getFormTemplate();
    }

    public function process()
    {
        [
            'visual_appearance' => $visualAppearance,
            'donation_amount' => $donationAmount,
            'donor_information' => $donorInformation,
            'payment_information' => $paymentInformation,
            'donation_receipt' => $donationReceipt,
            'introduction' => $introduction,
        ] = $this->formV2->getFormTemplateSettings();
    }
}
