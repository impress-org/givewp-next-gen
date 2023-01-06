<?php

namespace Give\NextGen\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Concerns\HasLabel;
use Give\Framework\FieldsAPI\Concerns\HasName;
use Give\Framework\FieldsAPI\Field;
use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\Contracts\Jsonable;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetail;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetailCollection;

use function array_map;

class DonationReceipt implements Arrayable, Jsonable
{
    /**
     * @var Donation
     */
    public $donation;
    /**
     * @var ReceiptDetailCollection
     */
    protected $donorDetails;
    /**
     * @var ReceiptDetailCollection
     */
    protected $donationDetails;
    /**
     * @var ReceiptDetailCollection
     */
    protected $additionalDetails;
    /**
     * @var ReceiptDetailCollection
     */
    protected $subscriptionDetails;
    /**
     * @var array
     */
    protected $settings;

    /**
     * @unreleased
     */
    public function __construct(Donation $donation)
    {
        $this->donation = $donation;
        $this->donorDetails = new ReceiptDetailCollection();
        $this->donationDetails = new ReceiptDetailCollection();
        $this->subscriptionDetails = new ReceiptDetailCollection();
        $this->additionalDetails = new ReceiptDetailCollection();
        $this->settings = [];
    }

    /**
     * @unreleased
     */
    public function addAdditionalDetail(string $label, $value): DonationReceipt
    {
        $this->additionalDetails->addDetail(new ReceiptDetail($label, $value));

        return $this;
    }

    /**
     * @unreleased
     *
     * @param  string  $key
     * @param  mixed  $value
     *
     * @return DonationReceipt
     */
    public function addSetting(string $key, $value): DonationReceipt
    {
        $this->settings[$key] = $value;

        return $this;
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return [
            'settings' => $this->settings,
            'donorDetails' => $this->donorDetails->toArray(),
            'donationDetails' => $this->donationDetails->toArray(),
            'subscriptionDetails' => $this->subscriptionDetails->toArray(),
            'additionalDetails' => $this->additionalDetails->toArray(),
        ];
    }

    /**
     * @unreleased
     */
    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
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
    private function fillDonationDetails()
    {
        $this->donationDetails->addDetails([
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
            $this->donationDetails->addDetail(
                new ReceiptDetail(
                    __('Processing Fee', 'give'),
                    $this->donation->feeAmountRecovered->formatToDecimal()
                )
            );
        }

        $this->donationDetails->addDetail(
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
    private function fillDonorDetails()
    {
        $this->donorDetails->addDetails(
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
    private function fillAdditionalDetails()
    {
        if ($customFields = $this->getCustomFields()) {
            $this->additionalDetails->addDetails($customFields);
        }
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function fillSubscriptionDetails()
    {
        if ($this->donation->subscriptionId) {
            $subscription = $this->donation->subscription;

            $this->subscriptionDetails->addDetails([
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
    public function generate(): DonationReceipt
    {
        $this->fillSettings();
        $this->fillDonorDetails();
        $this->fillDonationDetails();
        $this->fillSubscriptionDetails();
        $this->fillAdditionalDetails();

        return $this;
    }

    /**
     * @unreleased
     */
    private function fillSettings()
    {
        $this->settings = array_merge($this->settings, [
            'currency' => $this->donation->amount->getCurrency()->getCode(),
            'donorDashboardUrl' => get_permalink(give_get_option('donor_dashboard_page')),
        ]);
    }
}
