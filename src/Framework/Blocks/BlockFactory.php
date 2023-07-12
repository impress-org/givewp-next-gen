<?php

namespace Give\Framework\Blocks;

class BlockFactory
{
    /**
     * @note Fields API conversion requires a string for the description, even if empty.
     *
     * @param            $title
     * @param            $description
     * @param BlockModel ...$innerBlocks
     *
     * @return BlockModel
     */
    public static function section($title = '', $description = '', BlockModel ...$innerBlocks)
    {
        return BlockModel::make([
            'name' => 'givewp/section',
            'attributes' => [
                'title' => $title,
                'description' => $description,
            ],
            'innerBlocks' => $innerBlocks,
        ]);
    }

    public static function paragraph($content)
    {
        return BlockModel::make([
            'name' => 'givewp/paragraph',
            'attributes' => [
                'content' => $content,
            ],
        ]);
    }

    public static function termsAndConditions(array $attributes)
    {
        return BlockModel::make([
            'name' => 'givewp/terms-and-conditions',
            'attributes' => array_merge([
                'useGlobalSettings' => false,
                'checkboxLabel' => __('I agree to the Terms and conditions.', 'give'),
                'displayType' => 'showFormTerms',
                'linkText' => __('Show terms', 'give'),
                'linkUrl' => '',
                'agreementText' => __(
                    'Acceptance of any contribution, gift or grant is at the discretion of the GiveWP. The GiveWP will not accept any gift unless it can be used or expended consistently with the purpose and mission of the GiveWP. No irrevocable gift, whether outright or life-income in character, will be accepted if under any reasonable set of circumstances the gift would jeopardize the donor’s financial security.The GiveWP will refrain from providing advice about the tax or other treatment of gifts and will encourage donors to seek guidance from their own professional advisers to assist them in the process of making their donation.',
                    'give'
                ),
                'modalHeading' => __('Do you consent to the following', 'give'),
                'modalAcceptanceText' => __('Accept', 'give'),
            ], $attributes),
        ]);
    }
}
