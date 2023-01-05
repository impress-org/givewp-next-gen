<?php

namespace Give\Tests\Unit\Framework\Receipts;

use Give\Donations\Models\Donation;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Actions\StoreCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use Give\NextGen\Framework\Receipts\DonationReceipt;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetail;
use Give\NextGen\Framework\Receipts\Properties\ReceiptDetailCollection;
use Give\Subscriptions\Models\Subscription;
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
        $receipt->generate();

        $donorDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Donor Name', 'give'),
                trim("{$donation->firstName} {$donation->lastName}")
            ),
            new ReceiptDetail(
                __('Email Address', 'give'),
                $donation->email
            ),
        ]);

        $donationDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Payment Status', 'give'),
                give_get_payment_statuses()[$donation->status->getValue()]
            ),
            new ReceiptDetail(
                __('Payment Method', 'give'),
                $donation->gateway()->getPaymentMethodLabel()
            ),
            new ReceiptDetail(
                __('Donation Amount', 'give'),
                $donation->amount->formatToDecimal()
            ),
            new ReceiptDetail(
                __('Donation Total', 'give'),
                $donation->amount->formatToDecimal()
            ),
        ]);

        $this->assertSame(
            $receipt->toArray(),
            [
                'settings' => [
                    'currency' => $receipt->donation->amount->getCurrency()->getCode(),
                    'donorDashboardUrl' => get_permalink(give_get_option('donor_dashboard_page')),
                ],
                'donorDetails' => $donorDetails->toArray(),
                'donationDetails' => $donationDetails->toArray(),
                'subscriptionDetails' => [],
                'additionalDetails' => [],
            ]
        );
    }

    /**
     * @unreleased
     */
    public function testToArrayShouldBeEmptyWithoutGenerate()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create();

        $receipt = new DonationReceipt($donation);

        $this->assertSame(
            $receipt->toArray(),
            [
                'settings' => [],
                'donorDetails' => [],
                'donationDetails' => [],
                'subscriptionDetails' => [],
                'additionalDetails' => [],
            ]
        );
    }

    /**
     * @unreleased
     */
    public function testToArrayReturnsExpectedArrayShapeWithSubscriptionDetails()
    {
        $subscription = Subscription::factory()->createWithDonation();
        $donation = $subscription->initialDonation();
        $receipt = new DonationReceipt($donation);
        $receipt->generate();

        $subscriptionDetails = new ReceiptDetailCollection([
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
                    $subscription->installments > 0 ? $subscription->installments : 'Ongoing'
                )
            ),
        ]);

        $this->assertSame(
            $receipt->toArray()['subscriptionDetails'],
            $subscriptionDetails->toArray()
        );
    }

    public function testToArrayDonationDetailsShouldDisplayFeeRecovered()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create([
            'feeAmountRecovered' => Money::fromDecimal(10, 'USD'),
        ]);

        $receipt = new DonationReceipt($donation);
        $receipt->generate();

        $donationDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Payment Status', 'give'),
                give_get_payment_statuses()[$donation->status->getValue()]
            ),
            new ReceiptDetail(
                __('Payment Method', 'give'),
                $donation->gateway()->getPaymentMethodLabel()
            ),
            new ReceiptDetail(
                __('Donation Amount', 'give'),
                $donation->intendedAmount()->formatToDecimal()
            ),
            new ReceiptDetail(
                __('Processing Fee', 'give'),
                $donation->feeAmountRecovered->formatToDecimal()
            ),
            new ReceiptDetail(
                __('Donation Total', 'give'),
                $donation->amount->formatToDecimal()
            ),
        ]);

        $this->assertSame(
            $receipt->toArray()['donationDetails'],
            $donationDetails->toArray()
        );
    }

    /**
     * @unreleased
     */
    public function testAddAdditionalDetailWithToArrayReturnsExpectedArrayShape()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create();

        $receipt = new DonationReceipt($donation);
        $receipt->generate();

        $receipt->addAdditionalDetail(
            __('Additional Detail', 'give'),
            'Additional Detail Value'
        );

        $additionalDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Additional Detail', 'give'),
                'Additional Detail Value'
            ),
        ]);

        $this->assertSame(
            $receipt->toArray()['additionalDetails'],
            $additionalDetails->toArray()
        );
    }

    /**
     * @unreleased
     */
    public function testAddAdditionalDetailWithToArrayReturnsExpectedArrayShapeBeforeAndAfterGenerate()
    {
        /** @var Donation $donation */
        $donation = Donation::factory()->create();

        $receipt = new DonationReceipt($donation);
        $receipt->addAdditionalDetail(
            __('Additional Detail Before Generate', 'give'),
            'Additional Detail Before Generate Value'
        );

        $receipt->generate();

        $receipt->addAdditionalDetail(
            __('Additional Detail After Generate', 'give'),
            'Additional Detail After Generate Value'
        );

        $additionalDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Additional Detail Before Generate', 'give'),
                'Additional Detail Before Generate Value'
            ),
            new ReceiptDetail(
                __('Additional Detail After Generate', 'give'),
                'Additional Detail After Generate Value'
            ),
        ]);

        $this->assertSame(
            $receipt->toArray()['additionalDetails'],
            $additionalDetails->toArray()
        );
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
        $receipt->generate();

        $additionalDetails = new ReceiptDetailCollection([
            new ReceiptDetail(
                __('Custom Text Field', 'give'),
                'Custom Text Block Value'
            ),
        ]);

        $this->assertSame(
            $receipt->toArray()['additionalDetails'],
            $additionalDetails->toArray()
        );
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
}