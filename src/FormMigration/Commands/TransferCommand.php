<?php

namespace Give\FormMigration\Commands;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
use Give\FormMigration\Actions\TransferDonations;
use Give\FormMigration\Concerns\Blocks\BlockDifference;
use Give\FormMigration\DataTransferObjects\FormMigrationPayload;
use Give\FormMigration\Pipeline;
use Give\Framework\Blocks\BlockModel;
use Give\Framework\Database\DB;
use WP_CLI;

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
     */
    public function __invoke( $args, $assoc_args )
    {
        [$formIdV3] = $args;
        $sourceId = give_get_meta($formIdV3, 'migratedFormId', true);

        $count = DB::table('give_revenue')
            ->where('form_id', $sourceId)
            ->count();

        if(\WP_CLI\Utils\get_flag_value($assoc_args, 'dry-run')) {
            WP_CLI::log(sprintf('Found %s donation(s) to transfer.', $count));
        } else {
            try {
                TransferDonations::from($sourceId)->transferTo($formIdV3);
                WP_CLI::success(sprintf('Transferred %s donation(s).', $count));
            } catch( \Exception $e ) {
                WP_CLI::error('Failed to transfer donations.');
            }
        }
    }


    protected function clearOutput()
    {
        system('clear || cls'); // Clear screen with cross-platform.
    }
}
