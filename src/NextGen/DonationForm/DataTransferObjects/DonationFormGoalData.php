<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\GoalTypeOptions;

/**
 * @unreleased
 */
class DonationFormGoalData implements Arrayable
{
      /**
     * @var int
     */
    public $formId;
    /**
     * @var array
     */
    public $formSettings;
    /**
     * @var false
     */
    public $isEnabled;
    /**
     * @var GoalTypeOptions
     */
    public $goalType;
    /**
     * @var int
     */
    public $targetAmount;

    /**
     * @unreleased
     */
    public function __construct(int $formId, array $formSettings)
    {
        $this->formId = $formId;
        $this->formSettings = $formSettings;
        $this->isEnabled = $formSettings['enableDonationGoal'] ?? false;
        $this->goalType = new GoalTypeOptions($formSettings['goalType'] ?? GoalTypeOptions::AMOUNT);
        $this->targetAmount = $this->formSettings['goalAmount'] ?? 0;
    }

    /**
     * @unreleased
     */
    public function getCurrentAmount(): int
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        if ($this->goalType->isDonors()) {
            return $donationFormRepository->getTotalNumberOfDonors($this->formId);
        }

        if ($this->goalType->isDonations()) {
            return $donationFormRepository->getTotalNumberOfDonations($this->formId);
        }

        return $donationFormRepository->getTotalRevenue($this->formId);
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        $currentAmount = $this->getCurrentAmount();

        return [
            'type' => $this->goalType->getValue(),
            'enabled' => $this->isEnabled,
            'show' => $this->isEnabled,
            'currentAmount' => $currentAmount,
            'currentAmountFormatted' => $this->goalType->isAmount() ? Money::fromDecimal(
                $currentAmount,
                give_get_currency()
            )->formatToLocale() : $currentAmount,
            'targetAmount' => $this->targetAmount,
            'targetAmountFormatted' => $this->goalType->isAmount() ? Money::fromDecimal(
                $this->targetAmount,
                give_get_currency()
            )->formatToLocale() : $this->targetAmount,
            'label' => $this->goalType->isDonors() ? __('donors', 'give') : __('donations', 'give'),
            'progressPercentage' => !$currentAmount ? 0 : ($currentAmount / $this->targetAmount) * 100
        ];
    }
}