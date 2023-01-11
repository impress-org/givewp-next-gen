<?php

namespace Give\Tests\Feature\Gateways;

use Give\Donations\Models\Donation;
use Give\Framework\PaymentGateways\Commands\RedirectOffsite;
use Give\NextGen\DonationForm\Actions\GenerateDonationConfirmationReceiptUrl;
use Give\NextGen\Gateways\NextGenTestGateway\NextGenTestGateway;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

class NextGenTestGatewayTest extends TestCase
{
    use RefreshDatabase;

    public function testShouldCreatePaymentAndReturnRedirect()
    {
        $gateway = new NextGenTestGateway();
        $donation = Donation::factory()->create();
        $gatewayData = ['testGatewayIntent' => 'test-gateway-intent'];

        $response = $gateway->createPayment($donation, $gatewayData);

        $redirectUrl = (new GenerateDonationConfirmationReceiptUrl())($donation->purchaseKey);

        $command = new RedirectOffsite($redirectUrl);

        $this->assertInstanceOf(RedirectOffsite::class, $response);
        $this->assertSame($command->redirectUrl, $response->redirectUrl);
    }
}
