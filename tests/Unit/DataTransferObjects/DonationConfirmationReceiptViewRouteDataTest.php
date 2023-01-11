<?php

namespace Give\Tests\Unit\DataTransferObjects;

use Give\NextGen\DonationForm\DataTransferObjects\DonationConfirmationReceiptViewRouteData;
use Give\Tests\TestCase;

/**
 * @unreleased
 */
class DonationConfirmationReceiptViewRouteDataTest extends TestCase
{
    /**
     * @unreleased
     *
     * @return void
     */
    public function testShouldReturnReceiptId()
    {
        $data = DonationConfirmationReceiptViewRouteData::fromRequest([
            'receipt-id' => 'unique-receipt-id',
        ]);

        $this->assertSame('unique-receipt-id', $data->receiptId);
    }
}
