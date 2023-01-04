<?php

namespace Give\Tests\Unit\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\NextGen\DonationForm\Actions\StoreCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use Give\NextGen\Framework\Receipts\DonationReceipt;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

class TestDonationReceipt extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     */
    public function testToArrayReturnsExpectedArrayShape()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create();

        $receipt = new DonationReceipt($donation);

        $this->assertSame($receipt->toArray(), [
            'settings' => [
                'currency' => $donation->amount->getCurrency()->getCode(),
            ],
            'donorDetails' => [
                $this->addDetail(
                    __('Donor Name', 'give'),
                    trim("{$donation->firstName} {$donation->lastName}")
                ),
                $this->addDetail(
                    __('Email Address', 'give'),
                    $donation->email
                ),
            ],
            'donationDetails' => [
                $this->addDetail(
                    __('Payment Status', 'give'),
                    give_get_payment_statuses()[$donation->status->getValue()]
                ),
                $this->addDetail(
                    __('Payment Method', 'give'),
                    $donation->gateway()->getPaymentMethodLabel()
                ),
                $this->addDetail(
                    __('Donation Amount', 'give'),
                    $donation->amount->formatToDecimal()
                ),
                $this->addDetail(
                    __('Donation Total', 'give'),
                    $donation->amount->formatToDecimal()
                ),
            ],
            'additionalDetails' => [],
        ]);
    }

    /**
     * @unreleased
     */
    public function testAddAdditionalDetailWithToArrayReturnsExpectedArrayShape()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create();

        $receipt = new DonationReceipt($donation);
        $receipt->addAdditionalDetail(
            __('Additional Detail', 'give'),
            'Additional Detail Value'
        );

        $this->assertSame($receipt->toArray(), [
            'settings' => [
                'currency' => $donation->amount->getCurrency()->getCode(),
            ],
            'donorDetails' => [
                $this->addDetail(
                    __('Donor Name', 'give'),
                    trim("{$donation->firstName} {$donation->lastName}")
                ),
                $this->addDetail(
                    __('Email Address', 'give'),
                    $donation->email
                ),
            ],
            'donationDetails' => [
                $this->addDetail(
                    __('Payment Status', 'give'),
                    give_get_payment_statuses()[$donation->status->getValue()]
                ),
                $this->addDetail(
                    __('Payment Method', 'give'),
                    $donation->gateway()->getPaymentMethodLabel()
                ),
                $this->addDetail(
                    __('Donation Amount', 'give'),
                    $donation->amount->formatToDecimal()
                ),
                $this->addDetail(
                    __('Donation Total', 'give'),
                    $donation->amount->formatToDecimal()
                ),
            ],
            'additionalDetails' => [
                $this->addDetail(
                    __('Additional Detail', 'give'),
                    'Additional Detail Value'
                ),
            ],
        ]);
    }

    /**
     * @unreleased
     */
    public function testToArrayReturnsExpectedArrayShapeWithCustomFields()
    {
        $donationForm = $this->createFormWithCustomFields(
            [
                BlockModel::make([
                    'name' => 'custom-block-editor/section',
                    'attributes' => ['title' => '', 'description' => ''],
                    'innerBlocks' => [
                        [
                            'name' => 'custom-block-editor/custom-text-block',
                            'attributes' => [
                                'fieldName' => 'custom_text_block_meta',
                                'storeAsDonorMeta' => false,
                                'storeAsDonationMeta' => true,
                                'displayInAdmin' => true,
                                'displayInReceipt' => true,
                                'label' => 'Custom Text Field',
                                'description' => ''
                            ],
                        ]
                    ]
                ])
            ]
        );

        /** @var Donation $donation */
        $donation = Donation::factory()->create([
            'formId' => $donationForm->id,
        ]);

        (new StoreCustomFields())($donationForm, $donation, ['custom_text_block_meta' => 'Custom Text Block Value']);

        $receipt = new DonationReceipt($donation);

        $this->assertSame($receipt->toArray(), [
            'settings' => [
                'currency' => $donation->amount->getCurrency()->getCode(),
            ],
            'donorDetails' => [
                $this->addDetail(
                    __('Donor Name', 'give'),
                    trim("{$donation->firstName} {$donation->lastName}")
                ),
                $this->addDetail(
                    __('Email Address', 'give'),
                    $donation->email
                ),
            ],
            'donationDetails' => [
                $this->addDetail(
                    __('Payment Status', 'give'),
                    give_get_payment_statuses()[$donation->status->getValue()]
                ),
                $this->addDetail(
                    __('Payment Method', 'give'),
                    $donation->gateway()->getPaymentMethodLabel()
                ),
                $this->addDetail(
                    __('Donation Amount', 'give'),
                    $donation->amount->formatToDecimal()
                ),
                $this->addDetail(
                    __('Donation Total', 'give'),
                    $donation->amount->formatToDecimal()
                ),
            ],
            'additionalDetails' => [
                $this->addDetail(
                    'Custom Text Field',
                    'Custom Text Block Value'
                ),
            ],
        ]);
    }

    /**
     * BlockModel[] $blocks
     *
     */
    protected function createFormWithCustomFields($blocks = []): DonationForm
    {
        /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customBlocks = $blocks ?: [
            BlockModel::make([
                'name' => 'custom-block-editor/section',
                'attributes' => ['title' => '', 'description' => ''],
                'innerBlocks' => [
                    [
                        'name' => 'custom-block-editor/custom-text-block',
                        'attributes' => [
                            'fieldName' => 'custom_text_block_meta',
                            'storeAsDonorMeta' => false,
                            'storeAsDonationMeta' => true,
                            'displayInAdmin' => true,
                            'displayInReceipt' => true,
                            'label' => 'Custom Text Field',
                            'description' => ''
                        ],
                    ]
                ]
            ])
        ];

        $form->blocks = BlockCollection::make(
            array_merge($form->blocks->getBlocks(), $customBlocks)
        );

        $form->save();

        return DonationForm::find($form->id);
    }

    /**
     * @unreleased
     */
    protected function addDetail(string $label, $value): array
    {
        return compact('label', 'value');
    }
}
