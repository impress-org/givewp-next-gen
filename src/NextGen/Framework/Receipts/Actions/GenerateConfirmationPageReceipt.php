<?php

namespace Give\NextGen\Framework\Receipts\Actions;

use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Concerns\HasLabel;
use Give\Framework\FieldsAPI\Concerns\HasName;
use Give\Framework\FieldsAPI\Field;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\Framework\Receipts\DonationReceipt;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetail;

class GenerateConfirmationPageReceipt
{
    /**
     * @unreleased
     */
    public function __invoke(DonationReceipt $receipt): DonationReceipt
    {
        $this->fillSettings($receipt);
        $this->fillDonorDetails($receipt);
        $this->fillDonationDetails($receipt);
        $this->fillSubscriptionDetails($receipt);
        $this->fillAdditionalDetails($receipt);

        return $receipt;
    }

    /**
     * @unreleased
     */
    protected function getCustomFields(Donation $donation): array
    {
        if (give(DonationFormRepository::class)->isLegacyForm($donation->formId)) {
            return [];
        }

        /** @var DonationForm $form */
        $form = DonationForm::find($donation->formId);

        $customFields = array_filter($form->schema()->getFields(), static function (Field $field) {
            /** $field->shouldDisplayInReceipt is a temporary macro */
            return $field->shouldDisplayInReceipt();
        });

        return array_map(static function (Field $field) use ($donation) {
            /** @var Field|HasLabel|HasName $field */
            return new ReceiptDetail(
                $field->getLabel(),
                give()->payment_meta->get_meta($donation->id, $field->getName(), true)
            );
        }, $customFields);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillDonationDetails(DonationReceipt $receipt)
    {
        /** @var PaymentGatewayRegister $paymentGatewayRegistrar */
        $paymentGatewayRegistrar = give(PaymentGatewayRegister::class);

        $receipt->donationDetails->addDetails([
                new ReceiptDetail(
                    __('Payment Status', 'give'),
                    $receipt->donation->status->label()
                ),
                new ReceiptDetail(
                    __('Payment Method', 'give'),
                    $paymentGatewayRegistrar->hasPaymentGateway(
                        $receipt->donation->gatewayId
                    ) ? $receipt->donation->gateway()->getPaymentMethodLabel() : $receipt->donation->gatewayId
                ),
                new ReceiptDetail(
                    __('Donation Amount', 'give'),
                    ['amount' => $receipt->donation->intendedAmount()->formatToDecimal()]
                ),
            ]
        );

        if ($receipt->donation->feeAmountRecovered) {
            $receipt->donationDetails->addDetail(
                new ReceiptDetail(
                    __('Processing Fee', 'give'),
                    ['amount' => $receipt->donation->feeAmountRecovered->formatToDecimal()]
                )
            );
        }

        $receipt->donationDetails->addDetail(
            new ReceiptDetail(
                __('Donation Total', 'give'),
                ['amount' => $receipt->donation->amount->formatToDecimal()]
            )
        );
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillDonorDetails(DonationReceipt $receipt)
    {
        $receipt->donorDetails->addDetails(
            [
                new ReceiptDetail(
                    __('Donor Name', 'give'),
                    trim("{$receipt->donation->firstName} {$receipt->donation->lastName}")
                ),
                new ReceiptDetail(
                    __('Email Address', 'give'),
                    $receipt->donation->email
                ),
            ]
        );
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillAdditionalDetails(DonationReceipt $receipt)
    {
        if ($receipt->donation->company) {
            $receipt->additionalDetails->addDetail(
                new ReceiptDetail(
                    __('Company Name', 'give'),
                    $receipt->donation->company
                )
            );
        }

        if ($customFields = $this->getCustomFields($receipt->donation)) {
            $receipt->additionalDetails->addDetails($customFields);
        }
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillSubscriptionDetails(DonationReceipt $receipt)
    {
        if ($receipt->donation->subscriptionId) {
            $subscription = $receipt->donation->subscription;

            $receipt->subscriptionDetails->addDetails([
                new ReceiptDetail(
                    __('Subscription', 'give'),
                    [
                        'amount' =>
                            sprintf(
                                '%s / %s',
                                $subscription->amount->formatToDecimal(),
                                $subscription->period->getValue()
                            )
                    ]
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
    private function fillSettings(DonationReceipt $receipt)
    {
        $receipt->settings->addSetting('currency', $receipt->donation->amount->getCurrency()->getCode());
        $receipt->settings->addSetting('donorDashboardUrl', get_permalink(give_get_option('donor_dashboard_page')));
    }
}