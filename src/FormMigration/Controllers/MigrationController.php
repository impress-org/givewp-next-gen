<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;

class MigrationController
{
    public function __invoke($formIdV2)
    {
        $payload = new FormMigrationPayload(
            DonationFormV2::find($formIdV2),
            DonationFormV3::factory()->make()
        );

        give(Pipeline::class)
            ->process($payload)
            ->finally(function($payload) {
                $payload->formV3->save();
            });

        die();
    }
}
