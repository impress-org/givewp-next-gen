<?php

namespace Give\NextGen\Framework\Receipts\Actions;

use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Concerns\HasLabel;
use Give\Framework\FieldsAPI\Concerns\HasName;
use Give\Framework\FieldsAPI\Field;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\Framework\Receipts\DonationReceipt;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetail;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetailCollection;
use Give\NextGen\Framework\Receipts\Properties\ReceiptSettings;

class GenerateReceiptFromDonation
{
    /**
     * @var Donation
     */
    protected $donation;

    /**
     * @unreleased
     *
     * @param  Donation  $donation
     *
     * @return DonationReceipt
     */
    public function __invoke(Donation $donation): DonationReceipt
    {
        $this->donation = $donation;
        $receipt = new DonationReceipt($donation);

        $this->generate($receipt);

        return $receipt;
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function generate(DonationReceipt $receipt)
    {
        $this->fillSettings($receipt->settings);
        $this->fillDonorDetails($receipt->donorDetails);
        $this->fillDonationDetails($receipt->donationDetails);
        $this->fillSubscriptionDetails($receipt->subscriptionDetails);
        $this->fillAdditionalDetails($receipt->additionalDetails);
    }

    /**
     * @unreleased
     */
    protected function getCustomFields(): array
    {
        if (give(DonationFormRepository::class)->isLegacyForm($this->donation->formId)) {
            return [];
        }

        /** @var DonationForm $form */
        $form = DonationForm::find($this->donation->formId);

        $customFields = array_filter($form->schema()->getFields(), static function (Field $field) {
            /** $field->shouldDisplayInReceipt is a temporary macro */
            return $field->shouldDisplayInReceipt();
        });

        return array_map(function (Field $field) {
            /** @var Field|HasLabel|HasName $field */
            return new ReceiptDetail(
                $field->getLabel(),
                give()->payment_meta->get_meta($this->donation->id, $field->getName(), true)
            );
        }, $customFields);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillDonationDetails(ReceiptDetailCollection $donationDetails)
    {
        $donationDetails->addDetails([
                new ReceiptDetail(
                    __('Payment Status', 'give'),
                    give_get_payment_statuses()[$this->donation->status->getValue()]
                ),
                new ReceiptDetail(
                    __('Payment Method', 'give'),
                    $this->donation->gateway()->getPaymentMethodLabel()
                ),
                new ReceiptDetail(
                    __('Donation Amount', 'give'),
                    $this->donation->intendedAmount()->formatToDecimal()
                ),
            ]
        );

        if ($this->donation->feeAmountRecovered) {
            $donationDetails->addDetail(
                new ReceiptDetail(
                    __('Processing Fee', 'give'),
                    $this->donation->feeAmountRecovered->formatToDecimal()
                )
            );
        }

        $donationDetails->addDetail(
            new ReceiptDetail(
                __('Donation Total', 'give'),
                $this->donation->amount->formatToDecimal()
            )
        );
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillDonorDetails(ReceiptDetailCollection $donorDetails)
    {
        $donorDetails->addDetails(
            [
                new ReceiptDetail(
                    __('Donor Name', 'give'),
                    trim("{$this->donation->firstName} {$this->donation->lastName}")
                ),
                new ReceiptDetail(
                    __('Email Address', 'give'),
                    $this->donation->email
                ),
            ]
        );
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillAdditionalDetails(ReceiptDetailCollection $additionalDetails)
    {
        if ($customFields = $this->getCustomFields()) {
            $additionalDetails->addDetails($customFields);
        }
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillSubscriptionDetails(ReceiptDetailCollection $subscriptionDetails)
    {
        if ($this->donation->subscriptionId) {
            $subscription = $this->donation->subscription;

            $subscriptionDetails->addDetails([
                new ReceiptDetail(
                    __('Subscription', 'give'),
                    sprintf(
                        '%s / %s',
                        $subscription->amount->formatToDecimal(),
                        $subscription->period->getValue()
                    )
                ),
                new ReceiptDetail(
                    __('Subscription Status', 'give'),
                    $subscription->status->getValue()
                ),
                new ReceiptDetail(
                    __('Renewal Date', 'give'),
                    $subscription->renewsAt->format('F j, Y')
                ),
                new ReceiptDetail(
                    __('Progress', 'give'),
                    sprintf(
                        '%s / %s',
                        count($subscription->donations),
                        $subscription->installments > 0 ? $subscription->installments : __('Ongoing', 'give')
                    )
                ),
            ]);
        }
    }

    /**
     * @unreleased
     */
    private function fillSettings(ReceiptSettings $settings)
    {
        $settings->addSetting('currency', $this->donation->amount->getCurrency()->getCode());
        $settings->addSetting('donorDashboardUrl', get_permalink(give_get_option('donor_dashboard_page')));
    }
}