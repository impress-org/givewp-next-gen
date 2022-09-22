<?php

namespace Give\NextGen\Framework\Blocks;

use ArrayObject;
use Give\Framework\Support\Contracts\Arrayable;

class BlockCollection extends ArrayObject implements Arrayable
{
    /**
     * @var BlockModel[]
     */
    public $blocks;

    /**
     * @unreleased
     *
     * @param  BlockModel[]  $blocks
     */
    public function __construct($blocks)
    {
        parent::__construct($blocks);

        $this->blocks = $blocks;
    }

    /**
     * @unreleased
     *
     * @param  BlockModel[]  $blocks
     */
    public static function make($blocks): self
    {
        return new self($blocks);
    }

    /**
     * @unreleased
     */
    public static function fromJson($blocksJson): self
    {
        $blocksJson = json_decode($blocksJson, true, JSON_UNESCAPED_SLASHES);

        $blocks = [];
        foreach ($blocksJson as $block) {
            $blocks[] = BlockModel::make($block);
        }

        return new self($blocks);
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
        return array_map(static function (BlockModel $block) {
            return $block->toArray();
        }, $this->blocks);
    }
}
