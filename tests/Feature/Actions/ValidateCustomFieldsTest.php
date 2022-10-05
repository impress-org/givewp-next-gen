<?php

namespace TestsNextGen\Feature\Actions;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\NextGen\DonationForm\Actions\ValidateCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class ValidateCustomFieldsTest extends TestCase
{
    use RefreshDatabase;

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

        $action = new ValidateCustomFields();

        $action($form, ['NOT_custom_text_block_meta' => 'Custom Text Block Value']);
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

        $action = new ValidateCustomFields();

        $action($form, ['custom_text_block_meta' => '']);
    }

}
