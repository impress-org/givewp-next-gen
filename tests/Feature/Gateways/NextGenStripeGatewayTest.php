<?php

namespace Give\Tests\Feature\Gateways;

use Exception;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;
use PHPUnit_Framework_MockObject_MockBuilder;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;

class NextGenStripeGatewayTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     *
     * @throws ApiErrorException
     * @throws Exception
     */
    public function testFormSettingsShouldReturnData()
    {
        $mockGateway = $this->createMock(
            NextGenStripeGateway::class,
            function (PHPUnit_Framework_MockObject_MockBuilder $mockBuilder) {
                // partial mock gateway by setting methods on the mock builder
                $mockBuilder->setMethods(
                    ['generateStripePaymentIntent', 'getStripePublishableKey', 'getStripeConnectedAccountKey']
                );

                return $mockBuilder->getMock();
            }
        );

        $form = DonationForm::factory()->create();
        $currency = give_get_currency($form->id);
        $formDefaultAmount = give_get_default_form_amount($form->id);
        $amount = Money::fromDecimal(!empty($formDefaultAmount) ? $formDefaultAmount : '50', $currency);
        $stripePublishableKey = 'stripe-publishable-key';
        $stripeConnectedAccountKey = 'stripe-connected-account-key';

        $stripePaymentIntent = PaymentIntent::constructFrom([
            'id' => 'stripe-payment-intent-id',
            'amount' => $amount->formatToMinorAmount(),
            'currency' => $amount->getCurrency()->getCode(),
            'automatic_payment_methods' => ['enabled' => true],
            'client_secret' => 'client-secret',
        ],
            ['stripe_account' => $stripePublishableKey]
        );

        $mockGateway->method('generateStripePaymentIntent')
            ->willReturn($stripePaymentIntent);

        $mockGateway->method('getStripePublishableKey')
            ->willReturn($stripePublishableKey);

        $mockGateway->method('getStripeConnectedAccountKey')
            ->willReturn($stripeConnectedAccountKey);

        $settings = $mockGateway->formSettings($form->id);

        $this->assertSame($settings, [
            'successUrl' => give_get_success_page_uri(),
            'stripeKey' => $stripePublishableKey,
            'stripeClientSecret' => $stripePaymentIntent->client_secret,
            'stripeConnectedAccountKey' => $stripeConnectedAccountKey,
            'stripePaymentIntentId' => $stripePaymentIntent->id,
        ]);
    }
}
