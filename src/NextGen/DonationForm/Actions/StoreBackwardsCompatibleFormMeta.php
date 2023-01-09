<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\DonationForms\ValueObjects\DonationFormMetaKeys;
use Give\NextGen\DonationForm\Models\DonationForm;

class StoreBackwardsCompatibleFormMeta
{
    /**
     * @unreleased
     */
    public function __invoke(DonationForm $donationForm)
    {
        $this->storeDonationLevels($donationForm);
        $this->storeDonationGoal($donationForm);
    }

    /**
     * @unreleased
     */
    public function storeDonationLevels(DonationForm $donationForm)
    {
        $amountField = $donationForm->schema()->getNodeByName('amount');

        if (!$amountField) {
            return;
        }

        $donationLevels = $amountField->getLevels();
        $donationLevels = array_map(function ($donationLevel, $index) {
            return [
                '_give_id' => [
                    'level_id' => $index,
                ],
                '_give_amount' => $donationLevel
            ];
        }, $donationLevels, array_keys($donationLevels));

        // @todo: Replace with DonationFormMetaKeys::PRICE_OPTION when available.
        $this->saveSingleFormMeta($donationForm->id, '_give_price_option', 'multi');
        $this->saveSingleFormMeta($donationForm->id, DonationFormMetaKeys::DONATION_LEVELS, $donationLevels);
    }

    /**
     * @unreleased
     */
    public function storeDonationGoal(DonationForm $donationForm)
    {
        $this->saveSingleFormMeta(
            $donationForm->id,
            DonationFormMetaKeys::GOAL_OPTION,
            $donationForm->settings->enableDonationGoal ? 'enabled' : 'disabled'
        );

        $goalType = $donationForm->settings->goalType->getValue();
        $goalType = ($goalType === 'donations') ? 'donation' : $goalType; // @todo Mismatch. Legacy uses "donation" instead of "donations".
        $this->saveSingleFormMeta($donationForm->id, '_give_goal_format', $goalType);

        $metaLookup = [
            'donation' => '_give_number_of_donation_goal',
            'donors' => '_give_number_of_donor_goal',
            'amount' => '_give_set_goal',
        ];

        $goalAmount = ('amount' === $goalType) ? give_sanitize_amount_for_db(
            $donationForm->settings->goalAmount
        ) : $donationForm->settings->goalAmount;
        $this->saveSingleFormMeta($donationForm->id, $metaLookup[$goalType], $goalAmount);
    }

    /**
     * @unreleased
     */
    protected function saveSingleFormMeta($formId, $metaKey, $metaValue)
    {
        if (give()->form_meta->get_meta($formId, $metaKey, true)) {
            give()->form_meta->update_meta($formId, $metaKey, $metaValue);
        } else {
            give()->form_meta->add_meta($formId, $metaKey, $metaValue);
        }
    }
}
