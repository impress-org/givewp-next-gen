<?php

namespace Give\NextGen\Framework\Blocks;

use ArrayObject;
use Give\Framework\Support\Contracts\Arrayable;

class BlockCollection extends ArrayObject implements Arrayable
{
    /**
     * @unreleased
     *
     * @param  BlockModel[]  ...$blocks
     */
    public function __construct(...$blocks)
    {
        parent::__construct($blocks);
    }

    /**
     * @unreleased
     */
    public static function make(array $blocks): BlockCollection
    {
        $blockModels = array_map([BlockModel::class, 'make'], $blocks);
        return new BlockCollection(...$blockModels);
    }

    /**
     * @unreleased
     */
    public static function fromJson($blocksJson): BlockCollection
    {
        return self::make(
            json_decode($blocksJson, true, JSON_UNESCAPED_SLASHES)
        );
    }

    /**
     * @unreleased
     *
     * @return false|string
     */
    public function toJson()
    {
        return json_encode($this->toArray(), JSON_UNESCAPED_SLASHES);
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return $this->getArrayCopy();
    }
}
