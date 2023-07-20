<?php

namespace Give\FormMigration\Controllers;

use Give\DonationForms\Models\DonationForm;
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

    public function __invoke(DonationForm $formV3)
    {
        DB::transaction(function() use ($formV3) {

            $formV2Id = give_get_meta($formV3->id, 'migratedFormId', true);

            DB::table('give_donationmeta')
                ->where('meta_key', '_give_payment_form_id')
                ->where('meta_value', $formV2Id)
                ->update(['meta_value' => $formV3->id]);

            DB::table('give_revenue')
                ->where('form_id', $formV2Id)
                ->update(['meta_value' => $formV3->id]);
        });

        return new WP_REST_Response(array('errors' => [], 'successes' => [
            $formV3->id
        ]));
    }
}
