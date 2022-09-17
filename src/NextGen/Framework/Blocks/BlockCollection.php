<?php

namespace Give\NextGen\Framework\Blocks;

use ArrayObject;
use Give\Framework\Support\Contracts\Arrayable;

class BlockCollection extends ArrayObject implements Arrayable
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

    public function toArray(): array
    {
        return $this->getArrayCopy();
    }
}
