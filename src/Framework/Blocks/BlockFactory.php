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
}
