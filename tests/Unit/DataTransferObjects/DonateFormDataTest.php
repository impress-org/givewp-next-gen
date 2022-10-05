<?php

namespace TestsNextGen\Unit\DataTransferObjects;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Donors\Models\Donor;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\DataTransferObjects\DonateFormData;
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
            'customFields' => []
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

         $formData = DonateFormData::fromRequest((array)$data);

        $this->assertEquals($donation->getAttributes(), $formData->toDonation($donor->id)->getAttributes());
    }

}
