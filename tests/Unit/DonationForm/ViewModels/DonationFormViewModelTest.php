<?php

namespace Give\Tests\Unit\DonationForm\VieModels;

use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\Actions\GenerateDonationFormValidationRouteUrl;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormGoalData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\GoalType;
use Give\NextGen\DonationForm\ViewModels\DonationFormViewModel;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

class DonationFormViewModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @since 0.1.0
     */
    public function testExportsShouldReturnExpectedArrayOfData()
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::factory()->create();
        $donationFormRepository = new DonationFormRepository((new PaymentGatewayRegister));

        $donationFormGoalData = new DonationFormGoalData($donationForm->id, $donationForm->settings);
        $totalRevenue = $donationFormRepository->getTotalRevenue($donationForm->id);
        $goalType = $donationForm->settings->goalType ?? GoalType::AMOUNT();
        $donateUrl = (new GenerateDonateRouteUrl())();
        $validateUrl = (new GenerateDonationFormValidationRouteUrl())();
        $formDataGateways = $donationFormRepository->getFormDataGateways($donationForm->id);
        $formApi = $donationFormRepository->getFormSchemaFromBlocks(
            $donationForm->id,
            $donationForm->blocks
        )->jsonSerialize();

        $viewModel = new DonationFormViewModel($donationForm->id, $donationForm->blocks, $donationForm->settings);

        $this->assertEquals($viewModel->exports(), [
            'donateUrl' => $donateUrl,
            'validateUrl' => $validateUrl,
            'inlineRedirectRoutes' => [
                'donation-confirmation-receipt-view'
            ],
            'registeredGateways' => $formDataGateways,
            'form' => array_merge($formApi, [
                'settings' => $donationForm->settings,
                'currency' => give_get_currency(),
                'goal' => $donationFormGoalData->toArray(),
                'stats' => [
                    'totalRevenue' => $totalRevenue,
                    'totalCountValue' => $goalType->isDonors() ?
                        $donationFormRepository->getTotalNumberOfDonors($donationForm->id) :
                        $donationFormRepository->getTotalNumberOfDonations($donationForm->id),
                    'totalCountLabel' => $goalType->isDonors() ? __('donors', 'give') : __(
                        'donations',
                        'give'
                    ),
                ],
            ]),
        ]);
    }
}
