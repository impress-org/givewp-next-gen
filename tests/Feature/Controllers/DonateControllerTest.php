<?php

namespace TestsNextGen\Feature\Controllers;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\NextGen\DonationForm\Controllers\DonateController;
use Give\NextGen\DonationForm\DataTransferObjects\DonateFormData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use Give\PaymentGateways\Gateways\TestGateway\TestGateway;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class DonateControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     * @return void
     * @throws Exception
     */
    public function testShouldThrowExceptionWhenCustomFieldDoesNotExistInFormSchema()
    {
        $this->expectException(InvalidArgumentException::class);

        $testGateway = new TestGateway();

        /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [ 'fieldName' => 'text_block_meta', 'title' => 'Custom Text Field', 'description' => '' ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        $formData = DonateFormData::fromRequest([
            'gatewayId' => $testGateway::id(),
            'amount' => 50,
            'currency' => 'USD',
            'firstName' => 'Bill',
            'lastName' => 'Murray',
            'email' => 'bill@murray.com',
            'formId' => $form->id,
            'company' => null,
            'honorific' => null,
            'customFields' => [
                'NOT_text_block_meta' => 'Im not the Custom Text Field'
            ]
        ]);

        $donateController = new DonateController();

        $donateController->donate($formData, $testGateway);
    }

    /**
     * @unreleased
     * @return void
     * @throws Exception
     */
    public function testShouldThrowExceptionWhenCustomFieldIsRequiredAndEmpty()
    {
        $this->expectException(InvalidArgumentException::class);

        $testGateway = new TestGateway();

        /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel =  BlockModel::make([
            'name' => 'custom-block-editor/section',
            'attributes' => [ 'title' => '', 'description' => '' ],
            'innerBlocks' => [
                [
                    'name' => 'custom-block-editor/custom-text-block',
                    'attributes' => [
                        'fieldName' => 'text_block_meta',
                        'title' => 'Custom Text Field',
                        'description' => '',
                        'isRequired' => true
                    ],
                ]
            ]
        ]);

        $form->blocks = BlockCollection::make(
            array_merge([$customFieldBlockModel], $form->blocks->getBlocks())
        );

        $form->save();

        $formData = DonateFormData::fromRequest([
            'gatewayId' => $testGateway::id(),
            'amount' => 50,
            'currency' => 'USD',
            'firstName' => 'Bill',
            'lastName' => 'Murray',
            'email' => 'bill@murray.com',
            'formId' => $form->id,
            'company' => null,
            'honorific' => null,
            'customFields' => [
                'text_block_meta' => ''
            ]
        ]);

        $donateController = new DonateController();

        $donateController->donate($formData, $testGateway);
    }
}
