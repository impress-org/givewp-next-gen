<?php

namespace Give\Tests\Unit\Actions;

use Give\NextGen\DonationForm\Actions\GenerateDonationConfirmationReceiptUrl;
use Give\NextGen\Framework\Routes\Route;
use Give\Tests\TestCase;

class GenerateDonationConfirmationReceiptUrlTest extends TestCase {
    /**
     * @unreleased
     *
     * @return void
     */
    public function testShouldReturnValidUrl()
    {
        $url = (new GenerateDonationConfirmationReceiptUrl())('receipt-id');

        $mockUrl = esc_url_raw(Route::url('donation-confirmation-receipt-view', ['receipt-id' => 'receipt-id']));

        $this->assertSame($mockUrl, $url);
    }
}
