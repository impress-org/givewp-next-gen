<?php

namespace Give\Tests\Unit\CustomFields\Views;

use Give\Donations\Models\Donation;
use Give\NextGen\CustomFields\Views\DonationDetailsView;
use Give\NextGen\DonationForm\Actions\StoreCustomFields;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

use function str_replace;

class TestDonationDetailsView extends TestCase
{
    use RefreshDatabase;

    public function testRenderShouldReturnCustomFieldsHtml()
    {
        /** @var DonationForm $form */
        $form = DonationForm::factory()->create();

        $customFieldBlockModel = BlockModel::make([
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
                        'title' => 'Custom Text Field',
                        'label' => 'Custom Text Field',
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

        (new StoreCustomFields())($form, $donation, ['custom_text_block_meta' => 'Custom Text Block Value']);

        $form = DonationForm::find($form->id);

        $fields = array_filter($form->schema()->getFields(), static function ($field) {
            return $field->shouldDisplayInAdmin() && !$field->shouldStoreAsDonorMeta();
        });

        $donationDetailsView = new DonationDetailsView($donation, $fields);

        $mockRender = "<div class='postbox' style='padding-bottom: 15px;'>
            <h3 class='handle'>Custom Fields</h3>
            <div class='inside'>
                <div>
                    <strong>Custom Text Field:</strong>&nbsp;
                    Custom Text Block Value
                </div>
            </div>
        </div>";

        $this->assertSame(
            str_replace(
                ' ',
                '',
                $mockRender
            ),
            str_replace(
                ' ',
                '',
                $donationDetailsView->render()
            )
        );
    }
}
