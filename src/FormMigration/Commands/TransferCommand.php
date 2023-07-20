<?php

namespace Give\FormMigration\Commands;

use Give\DonationForms\Models\DonationForm as DonationFormV3;
use Give\DonationForms\V2\Models\DonationForm as DonationFormV2;
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

        $query = DB::table('give_donationmeta')
            ->where('meta_key', '_give_payment_form_id')
            ->where('meta_value', give_get_meta($formIdV3, 'migratedFormId', true));

        if(\WP_CLI\Utils\get_flag_value($assoc_args, 'dry-run')) {
            WP_CLI::log(sprintf('Found %s donation(s) to transfer.', $query->count()));
        } else {
            $count = $query->update(['meta_value' => $formIdV3]);

            if(false === $count) {
                WP_CLI::error('Failed to transfer donations.');
            } else {
                WP_CLI::success(sprintf('Transferred %s donation(s).', $count));
            }
        }
    }


    protected function clearOutput()
    {
        system('clear || cls'); // Clear screen with cross-platform.
    }
}
