<?php

namespace Give\Tests\Feature\Gateways;

use Give\Donations\Models\Donation;
use Give\Framework\PaymentGateways\Commands\PaymentComplete;
use Give\PaymentGateways\Gateways\NextGenTestGateway\TestModeGateway;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

class NextGenTestGatewayTest extends TestCase
{
    use RefreshDatabase;

    public function testShouldCreatePaymentAndReturnPaymentComplete()
    {
        $gateway = new TestModeGateway();
        $donation = Donation::factory()->create();
        $gatewayData = ['testGatewayIntent' => 'test-gateway-intent'];

        $response = $gateway->createPayment($donation, $gatewayData);

        $intent = $gatewayData['testGatewayIntent'];
        $transactionId = "test-gateway-transaction-id-{$intent}-{$donation->id}-";

        $command = new PaymentComplete($transactionId);

        $this->assertInstanceOf(PaymentComplete::class, $response);
        $this->assertSame($command->gatewayTransactionId, $response->gatewayTransactionId);
    }
}
