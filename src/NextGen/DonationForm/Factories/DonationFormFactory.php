<?php

namespace Give\NextGen\DonationForm\Factories;

use Give\Framework\Models\Factories\ModelFactory;
use Give\NextGen\DonationForm\Actions\ConvertDonationFormBlocksToFieldsApi;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\Block;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;

class DonationFormFactory extends ModelFactory
{
    public function definition()
    {
        $blockCollection = $this->getBlockCollection();
        return [
            'title' => 'Form Title',
            'status' => DonationFormStatus::PENDING(),
            'settings' => [
                'enableDonationGoal' => false,
                'enableAutoClose' => false,
                'registration' => 'none',
                'goalFormat' => 'amount-raised',
            ],
            'blockCollection' => $blockCollection,
            'schema' => give(ConvertDonationFormBlocksToFieldsApi::class)($blockCollection),
        ];
    }

    protected function getBlockCollection(): BlockCollection
    {
        return new BlockCollection(
            new BlockModel('my-section', [
                'title' => 'My section',
                'description' => 'This is a section',
            ], new BlockCollection(
                new BlockModel('my-block', [], new BlockCollection())
            ))
        );
    }
}
