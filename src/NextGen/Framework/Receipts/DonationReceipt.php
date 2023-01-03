<?php

namespace Give\NextGen\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\Contracts\Jsonable;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;

class DonationReceipt implements Arrayable, Jsonable {
    /**
     * @var Donation
     */
    protected $donation;

    /**
     * @unreleased
     */
    public function __construct(Donation $donation)
    {
        $this->donation = $donation;
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        $receipt = [];

        $receipt['settings'] = [
            'currency' => $this->donation->amount->getCurrency()->getCode(),
        ];

        $receipt['donorDetails'] = [
            $this->addDetail(
                __('Donor Name', 'give'),
                trim("{$this->donation->firstName} {$this->donation->lastName}")
            ),
            $this->addDetail(
                __('Email Address', 'give'),
                $this->donation->email
            ),
        ];

        $receipt['donationDetails'] = [
            $this->addDetail(
                __('Payment Status', 'give'),
                give_get_payment_statuses()[$this->donation->status->getValue()]
            ),
            $this->addDetail(
                __('Payment Method', 'give'),
                $this->donation->gateway()->getPaymentMethodLabel()
            ),
            $this->addDetail(
                __('Donation Amount', 'give'),
                $this->donation->amount->formatToDecimal()
            ),
            $this->addDetail(
                __('Donation Total', 'give'),
                $this->donation->amount->formatToDecimal()
            ),
        ];

        $customFields = $this->getCustomFields();

        if ($customFields){
            $receipt['additionalDetails'] = $customFields;
        }

        return $receipt;
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
    protected function addDetail(string $label, $value): array
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
                $customFields[] = $this->addDetail(
                    $field->getLabel(),
                    give()->payment_meta->get_meta($this->donation->id, $field->getName(), true)
                );
            }
        });

        return $customFields;
    }
}
