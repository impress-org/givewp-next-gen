<?php

namespace Give\FormMigration\Steps\FormFields;

use Give\FormMigration\Contracts\FormMigrationStep;
use Give\Framework\Blocks\BlockFactory;

class LoginRegistration extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return $this->formV2->isUserRegistrationEnabled();
    }

    public function process()
    {
        $loginBlock = BlockFactory::login($this->formV2->isUserLoginRequired());
        $this->formV2->isUserLoginRequired()
            ? $this->fieldBlocks->insertBefore('givewp/donor-name', $loginBlock)
            : $this->fieldBlocks->insertAfter('givewp/email', $loginBlock);
    }
}
