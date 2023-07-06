<?php

namespace Give\FormMigration\Commands;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;
use Give\Framework\Blocks\BlockDifference;
use Give\Framework\Blocks\BlockModel;
use WP_CLI;

class MigrationCommand
{
    /**
     * Prints a greeting.
     *
     * ## OPTIONS
     *
     * <id>
     * : A form ID to migrate
     *
     * [--step]
     * : Whether to inspect each step
     */
    public function __invoke( $args, $assoc_args )
    {
        [$formIdV2] = $args;

        $payload = new FormMigrationPayload(
            DonationFormV2::find($formIdV2),
            DonationFormV3::factory()->make()
        );

        $pipeline = give(Pipeline::class);

        if(\WP_CLI\Utils\get_flag_value($assoc_args, 'step')) {
            $pipeline->beforeEach(function ($stepClass, $payload) {
                WP_CLI::log('Processing ' . $stepClass);
            });
            $pipeline->afterEach([$this, 'afterEach']);
        }

        $pipeline
            ->process($payload)
            ->finally(function($payload) {
                $payload->formV3->save();
                WP_CLI::success( 'Migration Complete ' . $payload->formV3->id );
            });
    }

    public function afterEach($stepClass, $payload, $_payload)
    {
        WP_CLI::log('Processed ' . $stepClass);

        (new BlockDifference($_payload->formV3->blocks))
            ->skip('givewp/section')
            ->onBlockAdded(function(BlockModel $block) {
                WP_CLI::log('');
                WP_CLI::log('Block added: ' . $block->name);
                WP_CLI::log(json_encode($block->getAttributes()));
                WP_CLI::log('');
            })
            ->onBlockDifference(function(BlockModel $block, $differences) {
                WP_CLI::log('');
                WP_CLI::log($block->name);
                WP_CLI::log('');
                foreach($differences as $key => $difference) {
                    WP_CLI::log($key);
                    WP_CLI::log(json_encode($difference['previous']) . ' => ' . json_encode($difference['current']));
                    WP_CLI::log('');
                }
            })
            ->diff($payload->formV3->blocks);

        fwrite( STDOUT, 'Continue?' . ' [enter] ' );
        fgets( STDIN );
        $this->clearOutput();
    }

    protected function clearOutput()
    {
        system('clear || cls'); // Clear screen with cross-platform.
    }
}
