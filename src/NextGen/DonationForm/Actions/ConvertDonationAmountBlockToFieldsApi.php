<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Donations\ValueObjects\DonationType;
use Give\Framework\FieldsAPI\Amount;
use Give\Framework\FieldsAPI\DonationAmount;
use Give\Framework\FieldsAPI\Exceptions\EmptyNameException;
use Give\Framework\FieldsAPI\Exceptions\NameCollisionException;
use Give\Framework\FieldsAPI\Field;
use Give\Framework\FieldsAPI\Group;
use Give\Framework\FieldsAPI\Hidden;
use Give\Framework\FieldsAPI\Radio;
use Give\NextGen\DonationForm\Rules\DonationTypeRule;
use Give\NextGen\DonationForm\Rules\Max;
use Give\NextGen\DonationForm\Rules\Min;
use Give\NextGen\DonationForm\Rules\Size;
use Give\NextGen\DonationForm\Rules\SubscriptionFrequencyRule;
use Give\NextGen\DonationForm\Rules\SubscriptionInstallmentsRule;
use Give\NextGen\DonationForm\Rules\SubscriptionPeriodRule;
use Give\NextGen\Framework\Blocks\BlockModel;
use Give\Subscriptions\ValueObjects\SubscriptionPeriod;


class ConvertDonationAmountBlockToFieldsApi
{

    /**
     * @unreleased
     *
     * @throws EmptyNameException
     * @throws NameCollisionException
     */
    public function __invoke(BlockModel $block, string $currency): DonationAmount
    {
        $amountField = DonationAmount::make('donationAmount')->tap(function (Group $group) use ($block, $currency) {
            $amountRules = ['required', 'numeric'];

            if (!$block->getAttribute('customAmount') &&
                $block->getAttribute('priceOption') === 'set') {
                $size = $block->getAttribute('setPrice');

                $amountRules[] = new Size($size);
            }

            if ($block->getAttribute('customAmount')) {
                if ($block->hasAttribute('customAmountMin')) {
                    $amountRules[] = new Min($block->getAttribute('customAmountMin'));
                }

                if ($block->hasAttribute('customAmountMax') && $block->getAttribute('customAmountMax') > 0) {
                    $amountRules[] = new Max($block->getAttribute('customAmountMax'));
                }
            }

            /** @var Amount $amountNode */
            $amountNode = $group->getNodeByName('amount');
            $amountNode
                ->label(__('Donation Amount', 'give'))
                ->levels(...array_map('absint', $block->getAttribute('levels')))
                ->allowLevels($block->getAttribute('priceOption') === 'multi')
                ->allowCustomAmount($block->getAttribute('customAmount'))
                ->fixedAmountValue($block->getAttribute('setPrice'))
                ->defaultValue(
                    $block->getAttribute('priceOption') === 'set' ?
                        $block->getAttribute('setPrice') : 50
                )
                ->rules(...$amountRules);

            /** @var Hidden $currencyNode */
            $currencyNode = $group->getNodeByName('currency');
            $currencyNode
                ->defaultValue($currency)
                ->rules('required', 'currency');
        });

        /**
         * TODO replace with real block attributes
         */
        $blockAttributes = $this->mockBlockAttributes();

        if (!$blockAttributes['recurringEnabled']) {
            $donationType = Hidden::make('donationType')
                ->defaultValue(DonationType::SINGLE()->getValue())
                ->rules(new DonationTypeRule());

            $amountField->append(
                $donationType
            );
        } else {
            $donationTypeDefault = $blockAttributes['recurringOptInDefault'] ?
                DonationType::SUBSCRIPTION()->getValue() :
                DonationType::SINGLE()->getValue();

            $donationType = Hidden::make('donationType')
                ->defaultValue($donationTypeDefault)
                ->rules(new DonationTypeRule());

            $subscriptionPeriod = $this->getRecurringAmountPeriodField($blockAttributes);

            if ($blockAttributes['recurringDonationChoice'] === 'admin') {
                $billingInterval = (int)$blockAttributes['recurringBillingInterval'];
                $lengthOfTime = (int)$blockAttributes['recurringLengthOfTime'];

                $subscriptionFrequency = Hidden::make('frequency')
                    ->defaultValue($billingInterval)
                    ->rules(new SubscriptionFrequencyRule());

                $subscriptionInstallments = Hidden::make('installments')
                    ->defaultValue($lengthOfTime)
                    ->rules(new SubscriptionInstallmentsRule());
            } else {
                $subscriptionFrequency = Hidden::make('frequency')
                    ->defaultValue(null)
                    ->rules(new SubscriptionFrequencyRule());

                $subscriptionInstallments = Hidden::make('installments')
                    ->defaultValue(null)
                    ->rules(new SubscriptionInstallmentsRule());
            }

            $amountField->append(
                $donationType,
                $subscriptionPeriod,
                $subscriptionFrequency,
                $subscriptionInstallments
            );
        }

        return $amountField;
    }

    /**
     * @unreleased
     *
     * @throws EmptyNameException
     */
    protected function getRecurringAmountPeriodField(array $blockAttributes): Field
    {
        $donationChoice = $blockAttributes['recurringDonationChoice'];
        $recurringPeriod = $blockAttributes['recurringPeriod'];
        $recurringPeriodIsPreset = $recurringPeriod === 'preset';
        $recurringBillingPeriodOptions = $blockAttributes['recurringBillingPeriodOptions'];
        $recurringBillingPeriod = new SubscriptionPeriod($blockAttributes['recurringBillingPeriod']);
        $recurringOptInDefault = $blockAttributes['recurringOptInDefault'];

        // if admin fields are all hidden
        if ($donationChoice === 'admin') {
            return Hidden::make('period')
                ->defaultValue($recurringBillingPeriod->getValue())
                ->rules(new SubscriptionPeriodRule());
        }

        if ($recurringPeriodIsPreset) {
            $options = $this->mergePeriodOptionsWithOneTime([
                [
                    'value' => $recurringBillingPeriod->getValue(),
                    'label' => $recurringBillingPeriod->label(0),
                ],
            ]);
        } else {
            $options = $this->mergePeriodOptionsWithOneTime(
                array_map(static function ($option) {
                    $subscriptionPeriod = new SubscriptionPeriod($option);
                    return [
                        'value' => $subscriptionPeriod->getValue(),
                        'label' => $subscriptionPeriod->label(0),
                    ];
                }, $recurringBillingPeriodOptions)
            );
        }

        if ($recurringPeriodIsPreset && $recurringOptInDefault) {
            $defaultValue = $recurringBillingPeriod->getValue();
        } else {
            $defaultValue = 'one-time';
        }


        return Radio::make('period')
            ->defaultValue($defaultValue)
            ->label(__('Choose your donation frequency', 'give'))
            ->options(...$options)
            ->rules(new SubscriptionPeriodRule());
    }

    /**
     * @unreleased
     */
    protected function mergePeriodOptionsWithOneTime(array $options): array
    {
        return array_merge([
            [
                'value' => 'one-time',
                'label' => __('One Time', 'give'),
            ],
        ], $options);
    }

    /**
     * Temporary until the form builder settings are implemented
     */
    protected function mockBlockAttributes(): array
    {
        return [
            "recurringBillingPeriodOptions" => [
                "day",
                "week",
                "month",
                "year"
            ],
            "recurringBillingPeriod" => "month",
            "recurringBillingInterval" => 1,
            "recurringPeriod" => "preset",
            "recurringDonationChoice" => "donor",
            "recurringEnabled" => true,
            "recurringLengthOfTime" => "0",
            "recurringOptInDefault" => true
        ];
    }
}