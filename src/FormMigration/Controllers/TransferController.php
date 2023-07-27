<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm;
use Give\FormMigration\Actions\TransferDonations;
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
            $action = TransferDonations::from(
                give_get_meta($formV3->id, 'migratedFormId', true)
            );

            if($options->shouldChangeUrl()) // ...
            if($options->shouldDelete()) // ...
            if($options->shouldRedirect()) // ...

            $action->to($formV3->id);
        });

        return new WP_REST_Response(array('errors' => [], 'successes' => [
            $formV3->id
        ]));
    }
}
