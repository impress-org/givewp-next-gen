<?php

namespace Give\NextGen\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\Contracts\Jsonable;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;

class DonationReceipt implements Arrayable, Jsonable
{
    /**
     * @var Donation
     */
    public $donation;
    /**
     * @var array
     */
    protected $donorDetails;
    /**
     * @var array
     */
    protected $donationDetails;
    /**
     * @var array
     */
    protected $additionalDetails;

    /**
     * @unreleased
     */
    public function __construct(Donation $donation)
    {
        $this->donation = $donation;

        $this->donorDetails = [
            $this->detail(
                __('Donor Name', 'give'),
                trim("{$this->donation->firstName} {$this->donation->lastName}")
            ),
            $this->detail(
                __('Email Address', 'give'),
                $this->donation->email
            ),
        ];

        $this->donationDetails = [
            $this->detail(
                __('Payment Status', 'give'),
                give_get_payment_statuses()[$this->donation->status->getValue()]
            ),
            $this->detail(
                __('Payment Method', 'give'),
                $this->donation->gateway()->getPaymentMethodLabel()
            ),
            $this->detail(
                __('Donation Amount', 'give'),
                $this->donation->amount->formatToDecimal()
            ),
            $this->detail(
                __('Donation Total', 'give'),
                $this->donation->amount->formatToDecimal()
            ),
        ];

        if ($customFields = $this->getCustomFields()) {
            $this->additionalDetails = $customFields;
        } else {
            $this->additionalDetails = [];
        }
    }

    /**
     * @unreleased
     */
    public function addAdditionalDetail($label, $value)
    {
        $this->additionalDetails[] = $this->detail($label, $value);
    }

    /**
     * TODO: add subscription details
     * TODO: add support for heading, description settings
     * TODO: support dynamic tags for content
     * TODO: support pdf links
     * TODO: support link to donor dashboard
     * TODO: maybe support social sharing
     *
     * @unreleased
     */
    public function toArray(): array
    {
        return [
            'settings' => [
                'currency' => $this->donation->amount->getCurrency()->getCode(),
            ],
            'donorDetails' => $this->donorDetails,
            'donationDetails' => $this->donationDetails,
            'additionalDetails' => $this->additionalDetails,
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
    protected function detail(string $label, $value): array
    {
        return compact('label', 'value');
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

        $customFields = [];

        $form->schema()->walkFields(function ($field) use (&$customFields) {
            if ($field->shouldDisplayInReceipt()) {
                $customFields[] = $this->detail(
                    $field->getLabel(),
                    give()->payment_meta->get_meta($this->donation->id, $field->getName(), true)
                );
            }
        });

        return $customFields;
    }
}
