<?php

namespace Give\NextGen\DonationForm\Actions;

use Give\Framework\FieldsAPI\Amount;
use Give\Framework\FieldsAPI\Contracts\Node;
use Give\Framework\FieldsAPI\DonationSummary;
use Give\Framework\FieldsAPI\Email;
use Give\Framework\FieldsAPI\Exceptions\EmptyNameException;
use Give\Framework\FieldsAPI\Form;
use Give\Framework\FieldsAPI\Name;
use Give\Framework\FieldsAPI\Paragraph;
use Give\Framework\FieldsAPI\PaymentGateways;
use Give\Framework\FieldsAPI\Section;
use Give\Framework\FieldsAPI\Text;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;

class ConvertDonationFormBlocksToFieldsApi
{
    public function __invoke( $rootNodeName, $blocksContent ): Form
    {
        $form = new Form($rootNodeName);

        $blocks = BlockCollection::fromJson($blocksContent);

        foreach ($blocks as $block) {
            $form->append($this->convertTopLevelBlockToSection($block));
        }

        return $form;
    }

    /**
     * @unreleased
     */
    protected function convertTopLevelBlockToSection(BlockModel $block): Section
    {
        return Section::make($block->getShortName())
            ->label($block->attributes['title'])
            ->description($block->attributes['description'])
            ->append(...array_map([$this, 'convertInnerBlockToNode'], $block->innerBlocks->toArray()));
    }

    /**
     * @unreleased
     * @throws EmptyNameException
     */
    protected function convertInnerBlockToNode(BlockModel $block): Node
    {
        $node = $this->createNodeFromBlockWithUniqueAttributes($block);
        return $this->mapGenericBlockAttributesToNode($node, $block);
    }

    protected function createNodeFromBlockWithUniqueAttributes($block): Node
    {
        switch( $block->name ){

            case "custom-block-editor/donation-amount-levels":
                return Amount::make('amount')
                    ->levels(...array_map('absint', $block->attributes['levels']))
                    ->allowCustomAmount()
                    ->defaultValue(50)
                    ->required();

            case "custom-block-editor/donor-name":
                return $this->createNodeFromDonorNameBlock($block);

            case "custom-block-editor/paragraph":
                return Paragraph::make(substr(md5(mt_rand()), 0, 7))
                    ->content($block->attributes['content']);

            case "custom-block-editor/email-field":
                return Email::make('email')->emailTag('email');

            case "custom-block-editor/payment-gateways":
                return PaymentGateways::make('gatewayId');

            case "custom-block-editor/donation-summary":
                return DonationSummary::make('donation-summary');

            case "custom-block-editor/company-field":
                return Text::make('company');

            default:
                return Text::make($block->clientId);
        }
    }

    protected function createNodeFromDonorNameBlock(BlockModel $block): Node
    {
        return Name::make('name')->tap(function ($group) use ($block) {
            $group->getNodeByName('firstName')
                ->label($block->attributes['firstNameLabel'])
                ->placeholder($block->attributes['firstNamePlaceholder']);

            $group->getNodeByName('lastName')
                ->label($block->attributes['lastNameLabel'])
                ->placeholder($block->attributes['lastNamePlaceholder'])
                ->required($block->attributes['requireLastName']);

            if ($block->hasAttribute('showHonorific')) {
                $group->getNodeByName('honorific')
                    ->label('Title')
                    ->options(...$block->attributes['honorifics']);
            } else {
                $group->remove('honorific');
            }
        });
    }

    protected function mapGenericBlockAttributesToNode(Node $node, BlockModel $block): Node
    {
        if ('field' === $node->getNodeType()) {
            // Label
            if ($block->hasAttribute('label')) {
                $node->label($block->attributes['label']);
            }

            // Placeholder
            if ($block->hasAttribute('placeholder')) {
                $node->placeholder($block->attributes['placeholder']);
            }

            // Required
            if ($block->hasAttribute('isRequired')) {
                $node->required($block->attributes['isRequired']);
            }
        }

        return $node;
    }
}
