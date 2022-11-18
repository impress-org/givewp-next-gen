<?php

namespace Give\NextGen\DonationForm\ViewModels;

use Give\Framework\Database\DB;
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
     * TEMPORARY
     *
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
    private function goalCurrentValue(): int
    {
        $goalType = $this->goalType();

        if ($goalType->isDonors()) {
            return $this->totalNumberOfDonors();
        }

        if ($goalType->isDonations()) {
            return $this->totalNumberOfDonations();
        }

        return $this->totalRevenue();
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function goalTargetValue(): int
    {
        return $this->formSettings['goalAmount'] ?? 0;
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function totalNumberOfDonations(): int
    {
        return give()->donationFormsRepository->getFormDonationsCount($this->donationFormId);
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function totalNumberOfDonors(): int
    {
        return DB::table('give_donationmeta')
            ->where('meta_key', '_give_payment_donor_id')
            ->whereIn('donation_id', function ($builder) {
                $builder
                    ->select('donation_id')
                    ->from('give_donationmeta')
                    ->where('meta_key', '_give_payment_form_id')
                    ->where('meta_value', $this->donationFormId);
            })->count('DISTINCT meta_value');
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function totalRevenue(): int
    {
        $query = DB::table('give_formmeta')
            ->select('meta_value as totalRevenue')
            ->where('form_id', $this->donationFormId)
            ->where('meta_key', '_give_form_earnings')
            ->get();

        if (!$query) {
            return 0;
        }

        return $query->totalRevenue;
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function formGoalData(): array
    {
        return [
            'type' => $this->goalType()->getValue(),
            'enabled' => $this->formSettings['enableDonationGoal'] ?? false,
            'show' => $this->formSettings['enableDonationGoal'] ?? false,
            'currentValue' => $this->goalCurrentValue(),
            'currentValueFormatted' => $this->goalType()->isAmount() ? Money::fromDecimal(
                $this->goalCurrentValue(),
                give_get_currency()
            )->formatToLocale() : $this->goalCurrentValue(),
            'targetValue' => $this->goalTargetValue(),
            'targetValueFormatted' => $this->goalType()->isAmount() ? Money::fromDecimal(
                $this->goalTargetValue(),
                give_get_currency()
            )->formatToLocale() : $this->goalTargetValue(),
            'label' => $this->goalType()->isDonors() ? __('donors', 'give') : __('donations', 'give'),
            'progressPercentage' => ($this->goalCurrentValue() / $this->goalTargetValue()) * 100
        ];
    }

    /**
     * TEMPORARY
     *
     * @unreleased
     */
    private function formStatsData(): array
    {
        $totalRevenue = $this->totalRevenue();

        return [
            'totalRevenue' => $totalRevenue,
            'totalRevenueFormatted' => Money::fromDecimal(
                $totalRevenue,
                give_get_currency()
            )->formatToLocale(),
            'totalNumber' => $this->goalType()->isDonors() ? $this->totalNumberOfDonors(
            ) : $this->totalNumberOfDonations(),
            'totalNumberLabel' => $this->goalType()->isDonors() ? __('donors', 'give') : __(
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
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        $donateUrl = (new GenerateDonateRouteUrl())();

        $formDataGateways = $donationFormRepository->getFormDataGateways($this->donationFormId);
        $formApi = $donationFormRepository->getFormSchemaFromBlocks(
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
