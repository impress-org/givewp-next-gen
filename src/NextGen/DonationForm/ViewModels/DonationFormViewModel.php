<?php

namespace Give\NextGen\DonationForm\ViewModels;

use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\GoalTypeOptions;
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 */
class DonationFormViewModel
{
    /**
     * @var DonationForm
     */
    private $donationForm;
    /**
     * @var BlockCollection
     */
    private $formBlockOverrides;
    /**
     * @var array
     */
    private $formSettingOverrides;

    /**
     * @unreleased
     */
    public function __construct(
        DonationForm $donationForm,
        BlockCollection $formBlockOverrides = null,
        array $formSettingOverrides = []
    ) {
        $this->donationForm = $donationForm;
        $this->formBlockOverrides = $formBlockOverrides;
        $this->formSettingOverrides = $formSettingOverrides;
    }

    /**
     * @unreleased
     */
    public function designId(): string
    {
        return $this->formSettingOverrides['designId'] ?? ($this->donationForm->settings['designId'] ?? '');
    }

    /**
     * @unreleased
     */
    public function primaryColor(): string
    {
        return $this->formSettingOverrides['primaryColor'] ?? ($this->donationForm->settings['primaryColor'] ?? '');
    }

    /**
     * @unreleased
     */
    public function secondaryColor(): string
    {
        return $this->formSettingOverrides['secondaryColor'] ?? ($this->donationForm->settings['secondaryColor'] ?? '');
    }

    /**
     * @unreleased
     */
    public function primaryFont(): string
    {
        return $this->formSettingOverrides['primaryFont'] ?? ($this->donationForm->settings['primaryFont'] ?? 'Montserrat');
    }

    /**
     * @unreleased
     */
    public function goalType(): GoalTypeOptions
    {
        return new GoalTypeOptions(
            $this->formSettingOverrides['goalType'] ?? ($this->donationForm->settings['goalType'] ?? GoalTypeOptions::AMOUNT)
        );
    }

    /**
     * @unreleased
     */
    public function exports(): array
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        $donateUrl = (new GenerateDonateRouteUrl())();

        $formDataGateways = $donationFormRepository->getFormDataGateways($this->donationForm->id);
        $formApi = $donationFormRepository->getFormSchemaFromBlocks(
            $this->donationForm->id,
            $this->formBlockOverrides ?: $this->donationForm->blocks
        )->jsonSerialize();

        return [
            'form' => array_merge($formApi, [
                'currency' => give_get_currency(),
                'goal' => [
                    'type' => $this->goalType()->getValue(),
                    'showGoal' => $this->formSettingOverrides['enableDonationGoal'] ?? ($this->donationForm->settings['enableDonationGoal'] ?? false),
                    'currentValue' => 90,
                    'targetValue' => 100,
                    'label' => $this->goalType()->isDonors() ? __('donors', 'give') : __('donations', 'give'),
                    'progressPercentage' => (90 / 100) * 100
                ],
                'settings' => array_merge($this->donationForm->settings, $this->formSettingOverrides),
                'stats' => [
                    'totalRevenue' => give_get_meta($this->donationForm->id, '_give_form_earnings', true),
                    'goalTargetValue' => $this->formSettingOverrides['goalAmount'] ?? ($this->donationForm->settings['goalAmount'] ?? 0),
                    'totalNumberOfDonations' => give()->donationFormsRepository->getFormDonationsCount(
                        $this->donationForm->id
                    ),
                ]
            ]),
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways,
        ];
    }
}
