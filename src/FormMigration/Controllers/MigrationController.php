<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;
use WP_REST_Request;
use WP_REST_Response;

class MigrationController
{
    public function __invoke(WP_REST_Request $request)
    {
        $formIdV2 = $request->get_param('id');

        $payload = new FormMigrationPayload(
            DonationFormV2::find($formIdV2),
            DonationFormV3::factory()->make()
        );

        give(Pipeline::class)
            ->process($payload)
            ->finally(function($payload) {
                $payload->formV3->save();
            });

        return new WP_REST_Response([
            'success' => true,
            'data' => [
                'v2' => $payload->formV2->id,
                'v3' => $payload->formV3->id,
            ],
        ]);
    }
}
