<?php

namespace TestsNextGen\Unit\DonationForm\VieModels;

use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormGoalData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ValueObjects\GoalTypeOptions;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class DonationFormGoalDataTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     */
    public function testToArrayShouldReturnExpectedArrayOfData()
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::factory()->create();
        $donationFormGoalData = new DonationFormGoalData($donationForm->id, $donationForm->settings);
        $currentAmount = $donationFormGoalData->getCurrentAmount();
        $isEnabled = $donationForm->settings['enableDonationGoal'] ?? false;
        $goalType = new GoalTypeOptions($donationForm->settings['goalType'] ?? GoalTypeOptions::AMOUNT);
        $targetAmount = $donationForm->settings['goalAmount'] ?? 0;

        $this->assertEquals($donationFormGoalData->toArray(),  [
            'type' => $goalType->getValue(),
            'enabled' => $isEnabled,
            'show' => $isEnabled,
            'currentAmount' => $currentAmount,
            'currentAmountFormatted' => $goalType->isAmount() ? Money::fromDecimal(
                $currentAmount,
                give_get_currency()
            )->formatToLocale() : $currentAmount,
            'targetAmount' => $targetAmount,
            'targetAmountFormatted' => $goalType->isAmount() ? Money::fromDecimal(
                $targetAmount,
                give_get_currency()
            )->formatToLocale() : $targetAmount,
            'label' => $goalType->isDonors() ? __('donors', 'give') : __('donations', 'give'),
            'progressPercentage' => !$currentAmount ? 0 : ($currentAmount / $targetAmount) * 100
        ]);
    }
}
