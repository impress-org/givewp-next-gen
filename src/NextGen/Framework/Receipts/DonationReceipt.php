<?php

namespace Give\NextGen\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\Contracts\Jsonable;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetailCollection;
use Give\NextGen\Framework\Receipts\Properties\ReceiptSettings;

class DonationReceipt implements Arrayable, Jsonable
{
    /**
     * @var Donation
     */
    public $donation;
    /**
     * @var ReceiptSettings
     */
    public $settings;
    /**
     * @var ReceiptDetailCollection
     */
    public $donorDetails;
    /**
     * @var ReceiptDetailCollection
     */
    public $donationDetails;
    /**
     * @var ReceiptDetailCollection
     */
    public $additionalDetails;
    /**
     * @var ReceiptDetailCollection
     */
    public $subscriptionDetails;

    /**
     * @unreleased
     */
    public function __construct(Donation $donation)
    {
        $this->donation = $donation;
        $this->settings = new ReceiptSettings();
        $this->donorDetails = new ReceiptDetailCollection();
        $this->donationDetails = new ReceiptDetailCollection();
        $this->subscriptionDetails = new ReceiptDetailCollection();
        $this->additionalDetails = new ReceiptDetailCollection();
    }


    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return [
            'settings' => $this->settings->toArray(),
            'donorDetails' => $this->donorDetails->toArray(),
            'donationDetails' => $this->donationDetails->toArray(),
            'subscriptionDetails' => $this->subscriptionDetails->toArray(),
            'additionalDetails' => $this->additionalDetails->toArray(),
        ];
    }

    /**
     * @unreleased
     */
    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}