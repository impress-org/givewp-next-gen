<?php

namespace TestsNextGen\Unit\DataTransferObjects;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Donors\Models\Donor;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\DataTransferObjects\DonateFormRouteData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\PaymentGateways\Gateways\TestGateway\TestGateway;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

/**
 * @unreleased
 */
class DonateFormDataTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function testShouldTransformToDonationModel()
    {
        /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $data = (object)[
            'gatewayId' => TestGateway::id(),
            'amount' => 50,
            'currency' => 'USD',
            'firstName' => 'Bill',
            'lastName' => 'Murray',
            'email' => 'bill@murray.com',
            'formTitle' => $form->title,
            'formId' => $form->id,
            'company' => null,
            'honorific' => null,
        ];

        $donor = Donor::factory()->create();

        $donation = new Donation([
            'status' => DonationStatus::PENDING(),
            'gatewayId' => $data->gatewayId,
            'amount' => Money::fromDecimal($data->amount, $data->currency),
            'donorId' => $donor->id,
            'firstName' => $data->firstName,
            'lastName' => $data->lastName,
            'email' => $data->email,
            'formId' => $data->formId,
            'formTitle' => $data->formTitle,
            'company' => $data->company
        ]);

        $formData = DonateFormRouteData::fromRequest((array)$data);

        $data = $formData->validated();

        $this->assertEquals($donation->getAttributes(), $data->toDonation($donor->id)->getAttributes());
    }

}
