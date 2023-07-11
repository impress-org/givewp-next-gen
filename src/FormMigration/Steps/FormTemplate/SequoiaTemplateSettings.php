<?php

namespace Give\FormMigration\Steps\FormTemplate;

use Give\FormMigration\Actions\MapTemplateSettingsToDonationSummaryBlock;
use Give\FormMigration\Contracts\FormMigrationStep;
use Give\FormMigration\DataTransferObjects\DonationSummarySettings;
use Give\Framework\Blocks\BlockFactory;

class SequoiaTemplateSettings extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return 'sequoia' === $this->formV2->getFormTemplate();
    }

    public function process()
    {
        [
            'visual_appearance' => $visualAppearance,
            'introduction' => $introduction,
            'payment_amount' => $paymentAmount,
            'payment_information' => $paymentInformation,
            'thank-you' => $donationReceipt,
        ] = $this->formV2->getFormTemplateSettings();

        $this->visualAppearance($visualAppearance);
        $this->introduction($introduction);
        $this->paymentAmount($paymentAmount);
        $this->paymentInformation($paymentInformation);
        $this->donationReceipt($donationReceipt);
    }

    protected function visualAppearance($settings)
    {
        [
            'primary_color' => $primaryColor, // '#28C77B'
            'google-fonts' => $googleFonts, // 'enabled'
            'decimals_enabled' => $decimalsEnabled, // 'disabled'
        ] = $settings;

        $this->formV3->settings->primaryColor = $primaryColor;

        // @note `google-fonts` is not supported in v3 forms (defers to the Form Design).

        // @note `decimals_enabled` is not supported in v3 forms (defers to the Form Design).
    }

    protected function introduction($settings)
    {
        [
            'enabled' => $enabled, // 'enabled',
            'headline' => $headline, // 'Tributes Form',
            'description' => $description, // 'Help our organization by donating today! All donations go directly to making a difference for our cause.',
            'image' => $image, // '',
            'donate_label' => $donateLabel, // 'Donate Now',
        ] = $settings;

        if(give_is_setting_enabled($enabled)) {
            $introductionSection = BlockFactory::section($headline, $description);
            $this->fieldBlocks->prepend($introductionSection);
        }

        // @note `image` is not supported in v3 forms (defers to the Form Design).

        // @note `donate_label` is not supported in v3 forms (defers to the Form Design).
    }

    protected function paymentAmount($settings)
    {
        [
            'header_label' => $headerLabel, // 'Choose Amount',
            'content' => $content, // 'How much would you like to donate? As a contributor to WordPress we make sure your donation goes directly to supporting our cause. Thank you for your generosity!',
            'next_label' => $nextLabel, // 'Continue',
        ] = $settings;

        $this->fieldBlocks->findParentByChildName('givewp/donation-amount')
            ->setAttribute('title', $headerLabel)
            ->setAttribute('description', $content);

        // @note `next_label` is not supported in v3 forms (defers to the Form Design).
    }

    protected function paymentInformation($settings)
    {
        [
            'header_label' => $headerLabel, // 'Add Your Information',
            'headline' => $headline, // 'Who\'s giving today?',
            'description' => $description, // 'We’ll never share this information with anyone.',
            'donation_summary_enabled' => $donationSummaryEnabled, // 'enabled',
            'donation_summary_heading' => $donationSummaryHeading, // 'Here\'s what you\'re about to donate:',
            'donation_summary_location' => $donationSummaryLocation, // 'give_donation_form_before_submit',
            'checkout_label' => $checkoutLabel, // 'Donate Now',
        ] = $settings;

        $this->fieldBlocks->findParentByChildName('givewp/payment-gateways')
            ->setAttribute('title', $headline) // @note Should this be `headline` or `header_label`?
            ->setAttribute('description', $description);

        MapTemplateSettingsToDonationSummaryBlock::make($this->fieldBlocks)
            ->__invoke(DonationSummarySettings::make($settings));
    }

    protected function donationReceipt($settings)
    {
        [
            'headline' => $headline,
            'description' => $description,
        ] = $settings;

        $this->formV3->settings->receiptHeading = $headline;
        $this->formV3->settings->receiptDescription = $description;

        // @note `image`, `sharing`, `sharing_instruction`, `twitter_message` are not supported in v3 forms.
    }
}
