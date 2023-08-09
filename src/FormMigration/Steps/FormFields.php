<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Concerns\Blocks\BlockFactory;
use Give\FormMigration\Contracts\FormMigrationStep;

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
        $this->handleDonorComments();
    }

    /**
     * @unreleased
     */
    protected function handleDonorComments()
    {
        if (give_is_donor_comment_field_enabled($this->formV2->id)) {
            $block = BlockFactory::donorComments();

            $this->fieldBlocks->insertAfter('givewp/email', $block);
        }
    }
}
