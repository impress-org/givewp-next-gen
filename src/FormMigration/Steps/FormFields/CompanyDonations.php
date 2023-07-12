<?php

namespace Give\FormMigration\Steps\FormFields;

use Give\FormMigration\Contracts\FormMigrationStep;
use Give\Framework\Blocks\BlockFactory;

class CompanyDonations extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return $this->formV2->isCompanyFieldEnabled();
    }

    public function process()
    {
        $this->fieldBlocks->insertAfter('givewp/donor-name', BlockFactory::company(
            $this->formV2->isCompanyFieldRequired()
        ));
    }
}
