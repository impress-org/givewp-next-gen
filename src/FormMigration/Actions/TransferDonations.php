<?php

namespace Give\FormMigration\Actions;

use Give\FormMigration\DataTransferObjects\TransferOptions;
use Give\Framework\Database\DB;
use Give\Framework\Exceptions\Primitives\Exception;

class TransferDonations
{
    protected $sourceId;

    /** @var TransferOptions */
    protected $options;

    public function __construct($sourceId)
    {
        $this->sourceId = $sourceId;
    }

    public static function from($sourceId)
    {
        return new self($sourceId);
    }

    public function __invoke($destinationId)
    {
        $this->to($destinationId);
    }

    public function to($destinationId)
    {
        $updated = DB::table('give_donationmeta')
            ->where('meta_key', '_give_payment_form_id')
            ->where('meta_value', $this->sourceId)
            ->update(['meta_value' => $destinationId]);

        if(!$updated) {
            throw new Exception('Failed to transfer donations.');
        }

        $updated = DB::table('give_revenue')
            ->where('form_id', $this->sourceId)
            ->update(['meta_value' => $destinationId]);

        if(!$updated) {
            throw new Exception('Failed to transfer donations.');
        }
    }
}
