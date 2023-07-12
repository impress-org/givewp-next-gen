<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Contracts\FormMigrationStep;
use Give\Framework\Blocks\BlockFactory;
use Give\Framework\Blocks\BlockModel;

class FormFields extends FormMigrationStep
{
    public function process()
    {
        $this->fieldBlocks->findByName('givewp/donor-name')
            ->setAttribute('showHonorific', $this->formV2->isNameTitlePrefixEnabled())
            ->setAttribute('honorifics', $this->formV2->getNameTitlePrefixes())
            ->setAttribute('requireLastName', $this->formV2->isLastNameRequired());


        // Set default gateway
        // @note No corresponding setting in v3 for "Default Gateway"

        // Anonymous Donations
        // @note No corresponding setting in v3 for "Anonymous Donations"

        // Donor Comments
        // @note no corresponding setting in v3 for "Donor Comments"
    }
}
