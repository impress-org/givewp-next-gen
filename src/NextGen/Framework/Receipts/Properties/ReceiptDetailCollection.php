<?php

namespace Give\NextGen\Framework\Receipts\Properties;

use Give\Framework\Support\Contracts\Arrayable;

use function array_map;

class ReceiptDetailCollection implements Arrayable {
    /**
     * @var ReceiptDetail[]
     */
    protected $receiptDetails;

    /**
     * @unreleased
     *
     * @param  ReceiptDetail[]  $receiptDetails
     */
    public function __construct(array $receiptDetails = [])
    {
        $this->receiptDetails = $receiptDetails;
    }

    /**
     * @unreleased
     *
     * @param  ReceiptDetail  $receiptDetail
     * @return void
     */
    public function addDetail(ReceiptDetail $receiptDetail)
    {
        $this->receiptDetails[] = $receiptDetail;
    }

    /**
     * @unreleased
     *
     * @param  ReceiptDetail[]  $receiptDetails
     * @return void
     */
    public function addDetails(array $receiptDetails)
    {
        foreach ($receiptDetails as $detail) {
            $this->receiptDetails[] = $detail;
        }
    }

    /**
     * @return ReceiptDetail[]
     */
    public function getDetails(): array
    {
        return $this->receiptDetails;
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return array_map(static function (ReceiptDetail $receiptDetail) {
            return $receiptDetail->toArray();
        }, $this->receiptDetails);
    }
}
