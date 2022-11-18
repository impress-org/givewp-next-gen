<?php

namespace Give\NextGen\DonationForm\ViewModels;

use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\GoalTypeOptions;
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 */
class DonationFormViewModel
{
    /**
     * @var int
     */
    private $donationFormId;
    /**
     * @var BlockCollection
     */
    private $formBlocks;
    /**
     * @var array
     */
    private $formSettings;
    /**
     * @var DonationFormRepository
     */
    private $donationFormRepository;

    /**
     * @unreleased
     */
    public function __construct(
        int $donationFormId,
        BlockCollection $formBlocks,
        array $formSettings = []
    ) {
        $this->donationFormId = $donationFormId;
        $this->formBlocks = $formBlocks;
        $this->formSettings = $formSettings;
        $this->donationFormRepository = give(DonationFormRepository::class);
    }

    /**
     * @unreleased
     */
    public function designId(): string
    {
        return $this->formSettings['designId'] ?? '';
    }

    /**
     * @unreleased
     */
    public function primaryColor(): string
    {
        return $this->formSettings['primaryColor'] ?? '';
    }

    /**
     * @unreleased
     */
    public function secondaryColor(): string
    {
        return $this->formSettings['secondaryColor'] ?? '';
    }

    /**
     * @unreleased
     */
    public function primaryFont(): string
    {
        return $this->formSettings['primaryFont'] ?? 'Montserrat';
    }

    /**
     * @unreleased
     */
    private function goalType(): GoalTypeOptions
    {
        return new GoalTypeOptions($this->formSettings['goalType'] ?? GoalTypeOptions::AMOUNT);
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function goalCurrentAmount(GoalTypeOptions $goalType): int
    {
        if ($goalType->isDonors()) {
            return $this->donationFormRepository->getTotalNumberOfDonors($this->donationFormId);
        }

        if ($goalType->isDonations()) {
            return $this->donationFormRepository->getTotalNumberOfDonations($this->donationFormId);
        }

        return $this->donationFormRepository->getTotalRevenue($this->donationFormId);
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function goalTargetAmount(): int
    {
        return $this->formSettings['goalAmount'] ?? 0;
    }

    /**
     * @unreleased
     */
    private function formGoalData(): array
    {
        return [
            'type' => $this->goalType()->getValue(),
            'enabled' => $this->formSettings['enableDonationGoal'] ?? false,
            'show' => $this->formSettings['enableDonationGoal'] ?? false,
            'currentAmount' => $this->goalCurrentAmount($this->goalType()),
            'currentAmountFormatted' => $this->goalType()->isAmount() ? Money::fromDecimal(
                $this->goalCurrentAmount($this->goalType()),
                give_get_currency()
            )->formatToLocale() : $this->goalCurrentAmount($this->goalType()),
            'targetAmount' => $this->goalTargetAmount(),
            'targetAmountFormatted' => $this->goalType()->isAmount() ? Money::fromDecimal(
                $this->goalTargetAmount(),
                give_get_currency()
            )->formatToLocale() : $this->goalTargetAmount(),
            'label' => $this->goalType()->isDonors() ? __('donors', 'give') : __('donations', 'give'),
            'progressPercentage' => ($this->goalCurrentAmount($this->goalType()) / $this->goalTargetAmount()) * 100
        ];
    }

    /**
     * @unreleased
     */
    private function formStatsData(): array
    {
        $totalRevenue = $this->donationFormRepository->getTotalRevenue($this->donationFormId);

        return [
            'totalRevenue' => $totalRevenue,
            'totalRevenueFormatted' => Money::fromDecimal(
                $totalRevenue,
                give_get_currency()
            )->formatToLocale(),
            'totalNumberOfDonationsOrDonors' => $this->goalType()->isDonors() ?
                $this->donationFormRepository->getTotalNumberOfDonors($this->donationFormId) :
                $this->donationFormRepository->getTotalNumberOfDonations($this->donationFormId),
            'totalNumberOfDonationsOrDonorsLabel' => $this->goalType()->isDonors() ? __('donors', 'give') : __(
                'donations',
                'give'
            ),
        ];
    }

    /**
     * @unreleased
     */
    public function exports(): array
    {
        $donateUrl = (new GenerateDonateRouteUrl())();

        $formDataGateways = $this->donationFormRepository->getFormDataGateways($this->donationFormId);
        $formApi = $this->donationFormRepository->getFormSchemaFromBlocks(
            $this->donationFormId,
            $this->formBlocks
        )->jsonSerialize();

        return [
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways,
            'form' => array_merge($formApi, [
                'settings' => array_merge($this->formSettings, [
                    'showHeading' => true,
                    'heading' => __('Support Our Cause', 'give'),
                    'showDescription' => true,
                    'description' => __(
                        'Help our organization by donating today! All donations go directly to making a difference for our cause.',
                        'give'
                    ),

                ]),
                'currency' => give_get_currency(),
                'goal' => $this->formGoalData(),
                'stats' => $this->formStatsData()
            ]),
        ];
    }
}
