<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm;
use Give\FormMigration\Actions\TransferDonations;
use Give\FormMigration\Actions\TransferFormUrl;
use Give\FormMigration\DataTransferObjects\TransferOptions;
use Give\Framework\Database\DB;
use Give\Framework\QueryBuilder\QueryBuilder;
use WP_REST_Request;
use WP_REST_Response;

class TransferController
{
    protected $debugContext;

    /**
     * @var WP_REST_Request
     */
    protected $request;

    public function __construct(WP_REST_Request $request)
    {
        $this->request = $request;
    }

    public function __invoke(DonationForm $formV3, TransferOptions $options)
    {
        DB::transaction(function() use ($formV3, $options) {

            $v2FormId = give_get_meta($formV3->id, 'migratedFormId', true);

            TransferDonations::from($v2FormId)->to($formV3->id);

            if($options->shouldChangeUrl()) {
                TransferFormUrl::from($v2FormId)->to($formV3->id);
            }

            if($options->shouldDelete()) {
                wp_trash_post($v2FormId);
            }

            if($options->shouldRedirect()) {
                give_update_meta($formV3->id, 'redirectedFormId', $v2FormId);
            }
        });

        return new WP_REST_Response(array('errors' => [], 'successes' => [
            $formV3->id
        ]));
    }
}
