<?php

namespace Give\Framework\Blocks;

use Give\Framework\Support\Contracts\Arrayable;

class BlockCollection implements Arrayable
{
    /**
     * @var BlockModel[]
     */
    protected $blocks;

    /**
     * @since 0.1.0
     *
     * @param  BlockModel[]  $blocks
     */
    public function __construct(array $blocks)
    {
        $this->blocks = $blocks;
    }

    /**
     * @since 0.1.0
     *
     * @param  BlockModel[]  $blocks
     */
    public static function make($blocks): self
    {
        return new self($blocks);
    }

    /**
     * @since 0.1.0
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
     * @since 0.1.0
     *
     * @return false|string
     */
    public function toJson()
    {
        return json_encode($this->toArray(), JSON_UNESCAPED_SLASHES);
    }

    /**
     * @since 0.1.0
     */
    public function toArray(): array
    {
        return array_map(static function (BlockModel $block) {
            return $block->toArray();
        }, $this->blocks);
    }

    /**
     * @return BlockModel[]
     * @since 0.1.0
     *
     */
    public function getBlocks(): array
    {
        return $this->blocks;
    }

    /**
     * @unreleased
     *
     * @param string $nameOrId
     * @param BlockCollection|null $blockCollection
     * @param string $return self|parent
     * @return BlockCollection|null
     */
    public function findBlock(string $nameOrId, BlockCollection $blockCollection = null, string $return = 'self')
    {
        if ($blockCollection === null) {
            $blockCollection = $this;
        }

        foreach ($blockCollection->blocks as $block) {
            if ($block->name === $nameOrId || $block->clientId === $nameOrId) {
                if ($return === 'self') {
                    return $block->innerBlocks;
                } elseif ($return === 'parent') {
                    return $blockCollection;
                }
            } elseif ($block->innerBlocks) {
                $result = $this->findBlock($nameOrId, $block->innerBlocks, $return);
                if ($result) {
                    return $result;
                }
            }
        }

        return null;
    }

    /**
     * @unreleased
     */
    public function insertBefore(string $blockNameOrId, BlockModel $block): BlockCollection
    {
        $blockCollection = $this->findBlock($blockNameOrId, $this, 'parent');

        if (!$blockCollection) {
            return $this;
        }

        $innerBlocks = $blockCollection->blocks;
        $blockIndex = array_search($blockNameOrId, array_column($innerBlocks, wp_is_uuid($blockNameOrId) ? 'id' : 'name'));
        array_splice($innerBlocks, $blockIndex, 0, [$block]);
        $blockCollection->blocks = $innerBlocks;

        return $this;
    }

    /**
     * @unreleased
     */
    public function insertAfter(string $blockNameOrId, BlockModel $block): BlockCollection
    {
        $blockCollection = $this->findBlock($blockNameOrId, $this, 'parent');

        if (!$blockCollection) {
            return $this;
        }

        $innerBlocks = $blockCollection->blocks;
        $blockIndex = array_search($blockNameOrId, array_column($innerBlocks, wp_is_uuid($blockNameOrId) ? 'id' : 'name'));
        array_splice($innerBlocks, $blockIndex + 1, 0, [$block]);
        $blockCollection->blocks = $innerBlocks;

        return $this;
    }

    /**
     * @unreleased
     */
    public function prepend(string $blockNameOrId, BlockModel $block): BlockCollection
    {
        $blockCollection = $this->findBlock($blockNameOrId);

        if (!$blockCollection) {
            return $this;
        }

        $innerBlocks = $blockCollection->blocks;
        array_unshift($innerBlocks, $block);
        $blockCollection->blocks = $innerBlocks;

        return $this;
    }

    /**
     * @unreleased
     */
    public function append(string $blockNameOrId, BlockModel $block): BlockCollection
    {
        $blockCollection = $this->findBlock($blockNameOrId);

        if (!$blockCollection) {
            return $this;
        }
        
        $innerBlocks = $blockCollection->blocks;
        $innerBlocks[] = $block;
        $blockCollection->blocks = $innerBlocks;

        return $this;
    }
}
