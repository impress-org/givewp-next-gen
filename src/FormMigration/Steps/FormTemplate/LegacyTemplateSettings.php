<?php

namespace Give\FormMigration\Steps\FormTemplate;

use Give\FormMigration\Contracts\FormMigrationStep;

class LegacyTemplateSettings extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return 'legacy' === $this->formV2->getFormTemplate();
    }

    public function process()
    {
        [
            'display_settings' => $displaySettings,
        ] = $this->formV2->getFormTemplateSettings();
    }
}
