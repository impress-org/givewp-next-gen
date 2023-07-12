<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Contracts\FormMigrationStep;
use Give\Framework\Blocks\BlockFactory;

class TermsAndConditions extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return $this->formV2->isTermsEnabled();
    }

    public function process()
    {
        $this->fieldBlocks->insertAfter('givewp/payment-gateways', BlockFactory::termsAndConditions([
            'checkboxLabel' => $this->formV2->getTermsAgreementLabel(),
            'agreementText' => $this->formV2->getTermsAgreementText(),
        ]));
    }
}
