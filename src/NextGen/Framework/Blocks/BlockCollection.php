<?php

namespace Give\NextGen\Framework\Blocks;

use ArrayObject;

class BlockCollection extends ArrayObject
{
    public function __construct(BlockModel ...$blocks)
    {
        parent::__construct($blocks);
    }

    public static function make(array $blocks): BlockCollection
    {
        $blockModels = array_map([BlockModel::class, 'make'], $blocks);
        return new BlockCollection(...$blockModels);
    }

    public static function fromJson($blocksJson)
    {
        return BlockCollection::make(
            json_decode($blocksJson, true)
        );
    }
}
