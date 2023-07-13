<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Contracts\FormMigrationStep;

class FormTitle extends FormMigrationStep
{
    public function process()
    {
        $this->formV3->title = sprintf('%s [v3]', $this->formV2->title);
    }
}
