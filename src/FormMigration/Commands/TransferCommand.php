<?php

namespace Give\FormMigration\Commands;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\Actions\TransferDonations;
use Give\FormMigration\Concerns\Blocks\BlockDifference;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\DataTransferObjects\TransferOptions;
use Give\FormMigration\Pipeline;
use Give\Framework\Blocks\BlockModel;
use Give\Framework\Database\DB;
use WP_CLI;

use function WP_CLI\Utils\get_flag_value;

class TransferCommand
{
    /**
     * Prints a greeting.
     *
     * ## OPTIONS
     *
     * <id>
     * : A form ID to transfer donations
     *
     * [--dry-run]
     * : Whether to dry run
     *
     * [--changeUrl]
     * : Whether to change the URL
     *
     * [--delete]
     * : Whether to delete the old form
     *
     * [--redirect]
     * : Whether to redirect the old form in shortcodes and blocks
     */
    public function __invoke( $args, $assoc_args )
    {
        [$formIdV3] = $args;
        $sourceId = give_get_meta($formIdV3, 'migratedFormId', true);

        $count = DB::table('give_revenue')
            ->where('form_id', $sourceId)
            ->count();

        if(get_flag_value($assoc_args, 'dry-run')) {
            WP_CLI::log(sprintf('Found %s donation(s) to transfer.', $count));
        } else {
            try {
                DB::transaction(function() use ($formIdV3, $sourceId, $assoc_args) {
                    TransferOptions::fromArray([
                        'changeUrl' => get_flag_value($assoc_args, 'changeUrl'),
                        'delete' => get_flag_value($assoc_args, 'delete'),
                        'redirect' => get_flag_value($assoc_args, 'redirect'),
                    ]);
                    TransferDonations::from($sourceId)
                        ->to($formIdV3);
                });
                WP_CLI::success(sprintf('Transferred %s donation(s).', $count));
            } catch( \Exception $e ) {
                WP_CLI::error('Failed to transfer donations.');
            }
        }
    }
}
