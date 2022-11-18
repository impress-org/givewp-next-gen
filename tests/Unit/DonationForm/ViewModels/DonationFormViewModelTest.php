<?php

namespace TestsNextGen\Unit\DonationForm\VieModels;

use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormGoalData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\GoalTypeOptions;
use Give\NextGen\DonationForm\ViewModels\DonationFormViewModel;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class DonationFormViewModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     */
    public function testExportsShouldReturnExpectedArrayOfData()
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::factory()->create();
        $donationFormRepository = new DonationFormRepository((new PaymentGatewayRegister));

        $donationFormGoalData = new DonationFormGoalData($donationForm->id, $donationForm->settings);
        $totalRevenue = $donationFormRepository->getTotalRevenue($donationForm->id);
        $goalType = new GoalTypeOptions($donationForm->settings['goalType'] ?? GoalTypeOptions::AMOUNT);
        $donateUrl = (new GenerateDonateRouteUrl())();
        $formDataGateways = $donationFormRepository->getFormDataGateways($donationForm->id);
        $formApi = $donationFormRepository->getFormSchemaFromBlocks(
            $donationForm->id,
            $donationForm->blocks
        )->jsonSerialize();

        $viewModel = new DonationFormViewModel($donationForm->id, $donationForm->blocks, $donationForm->settings);

        $this->assertEquals($viewModel->exports(), [
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways,
            'form' => array_merge($formApi, [
                'settings' => $donationForm->settings,
                'currency' => give_get_currency(),
                'goal' => $donationFormGoalData->toArray(),
                'stats' => [
                    'totalRevenue' => $totalRevenue,
                    'totalRevenueFormatted' => Money::fromDecimal(
                        $totalRevenue,
                        give_get_currency()
                    )->formatToLocale(),
                    'totalNumberOfDonationsOrDonors' => $goalType->isDonors() ?
                        $donationFormRepository->getTotalNumberOfDonors($donationForm->id) :
                        $donationFormRepository->getTotalNumberOfDonations($donationForm->id),
                    'totalNumberOfDonationsOrDonorsLabel' => $goalType->isDonors() ? __('donors', 'give') : __(
                        'donations',
                        'give'
                    ),
                ],
            ]),
        ]);
    }
}
