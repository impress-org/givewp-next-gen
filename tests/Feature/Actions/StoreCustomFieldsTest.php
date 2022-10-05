<?php

namespace TestsNextGen\Feature\Actions;

use Give\Donations\Models\Donation;
use Give\Framework\Database\DB;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\NextGen\DonationForm\Actions\StoreCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class StoreCustomFieldsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function testShouldStoreAsDonorMeta()
    {
          /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [
                        'fieldName' => 'custom_text_block_meta',
                        'storeAsDonorMeta' => true,
                        'title' => 'Custom Text Field',
                        'description' => ''
                    ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        /** @var Donation $donation */
        $donation = Donation::factory()->create(['formId' => $form->id]);

        $action = new StoreCustomFields();

        $action($form, $donation, ['custom_text_block_meta' => 'Custom Text Block Value']);

        $query = DB::table('give_donormeta')
            ->select('meta_value')
            ->where('donor_id', $donation->donorId)
            ->where('meta_key', 'custom_text_block_meta')
        ->get();

        $this->assertSame('Custom Text Block Value', $query->meta_value);
    }

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function testShouldStoreAsDonationMeta()
    {
          /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [
                        'fieldName' => 'custom_text_block_meta',
                        'storeAsDonorMeta' => false,
                        'title' => 'Custom Text Field',
                        'description' => ''
                    ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        /** @var Donation $donation */
        $donation = Donation::factory()->create(['formId' => $form->id]);

        $action = new StoreCustomFields();

        $action($form, $donation, ['custom_text_block_meta' => 'Custom Text Block Value']);

        $query = DB::table('give_donationmeta')
            ->select('meta_value')
            ->where('donation_id', $donation->id)
            ->where('meta_key', 'custom_text_block_meta')
        ->get();

        $this->assertSame('Custom Text Block Value', $query->meta_value);
    }

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function testShouldThrowExceptionWhenCustomFieldDoesNotExistInFormSchema()
    {
        $this->expectException(InvalidArgumentException::class);

          /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [
                        'fieldName' => 'custom_text_block_meta',
                        'storeAsDonorMeta' => false,
                        'title' => 'Custom Text Field',
                        'description' => ''
                    ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        /** @var Donation $donation */
        $donation = Donation::factory()->create(['formId' => $form->id]);

        $action = new StoreCustomFields();

        $action($form, $donation, ['NOT_custom_text_block_meta' => 'Custom Text Block Value']);
    }

    /**
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function testShouldThrowExceptionWhenCustomFieldIsRequiredAndEmpty()
    {
        $this->expectException(InvalidArgumentException::class);

          /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [
                        'fieldName' => 'custom_text_block_meta',
                        'storeAsDonorMeta' => false,
                        'isRequired' => true,
                        'title' => 'Custom Text Field',
                        'description' => ''
                    ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        /** @var Donation $donation */
        $donation = Donation::factory()->create(['formId' => $form->id]);

        $action = new StoreCustomFields();

        $action($form, $donation, ['custom_text_block_meta' => '']);
    }

}
