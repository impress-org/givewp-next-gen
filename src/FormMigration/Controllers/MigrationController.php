<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;
use Give\Framework\Blocks\BlockDifference;
use Give\Framework\Blocks\BlockModel;
use Give\Log\Log;
use WP_REST_Request;
use WP_REST_Response;

class MigrationController
{
    protected $debugContext;

    public function __invoke(WP_REST_Request $request)
    {
        $formIdV2 = $request->get_param('id');

        $payload = new FormMigrationPayload(
            DonationFormV2::find($formIdV2),
            DonationFormV3::factory()->make()
        );

        give(Pipeline::class)
            ->afterEach(function($stepClass, $payload, $_payload) {
                (new BlockDifference($_payload->formV3->blocks))
                    ->skip('givewp/section')
                    ->onBlockAdded(function(BlockModel $block) {
                        $this->debugContext[] = [
                            'ADDED' => $block->name,
                            'ATTRIBUTES' => $block->getAttributes(),
                        ];
                    })
                    ->onBlockDifference(function(BlockModel $block, $differences) {
                        $this->debugContext[] = [
                            'UPDATED' => $block->name,
                            'ATTRIBUTES' => $differences,
                        ];
                    })
                    ->diff($payload->formV3->blocks);
            })
            ->process($payload)
            ->finally(function($payload) {
                $payload->formV3->save();
                Log::info(esc_html__('Form migrated from v2 to v3.', 'give'), $this->debugContext);
            });

        return new WP_REST_Response([
            'success' => true,
            'data' => [
                'v2' => $payload->formV2->id,
                'v3' => $payload->formV3->id,
                'debug' => $this->debugContext,
            ],
        ]);
    }
}
