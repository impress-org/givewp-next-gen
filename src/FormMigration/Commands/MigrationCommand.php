<?php

namespace Give\FormMigration\Commands;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;
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
            $pipeline->afterEach([$this, 'debugStep']);
        }

        $pipeline
            ->process($payload)
            ->finally(function($payload) {
                $payload->formV3->save();
                WP_CLI::success( 'Migration Complete ' . $payload->formV3->id );
            });
    }

    public function clearOutput()
    {
        system('clear || cls'); // Clear screen with cross-platform.
    }

    public function debugStep($stepClass, $payload, $_payload)
    {
        WP_CLI::log('Processed ' . $stepClass);

        $blockLookup = [];
        $_payload->formV3->blocks->walk(function(BlockModel $block) use (&$blockLookup) {
            $blockLookup[$block->clientId] = $block;
        });

        $payload->formV3->blocks->walk(function(BlockModel $block) use ($blockLookup) {
            if('givewp/section' === $block->name) return;

            if(!isset($blockLookup[$block->clientId])) {
                WP_CLI::log('');
                WP_CLI::log('Block added: ' . $block->name);
                WP_CLI::log(json_encode($block->getAttributes()));
                WP_CLI::log('');
                return;
            }

            $differences = [];
            foreach($block->getAttributes() as $key => $value) {
                $previousValue = $blockLookup[$block->clientId]->getAttributes()[$key] ?? null;
                if($previousValue !== $value) {
                    $differences[$key] = [
                        'previous' => $previousValue,
                        'current' => $value,
                    ];
                }
            }
            if($differences) {
                WP_CLI::log('');
                WP_CLI::log($block->name);
                WP_CLI::log('');
                foreach($differences as $key => $difference) {
                    WP_CLI::log($key);
                    WP_CLI::log(json_encode($difference['previous']) . ' => ' . json_encode($difference['current']));
                    WP_CLI::log('');
                }
            }
        });

        fwrite( STDOUT, 'Continue?' . ' [enter] ' );
        fgets( STDIN );
        $this->clearOutput();
    }
}
