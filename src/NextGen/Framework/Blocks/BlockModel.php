<?php

namespace Give\NextGen\Framework\Blocks;

/**
 * @unreleased
 * A structured model for a Gutenberg block.
 * Similar to WP_Block_Parser_Block, but without innerHTML or innerContent.
 * ... and without the HTML comments as structure.
 * ... but now with a Collection for innerBlocks :)
 */
class BlockModel
{
    /** @var string */
    public $name;

    /** @var array */
    public $attributes;

    /** @var BlockCollection */
    public $innerBlocks;

    /**
     * @param                 $name
     * @param array           $attributes
     * @param BlockCollection $innerBlocks
     */
    public function __construct($name, array $attributes, BlockCollection $innerBlocks)
    {
        $this->name = $name;
        $this->attributes = $attributes;
        $this->innerBlocks = $innerBlocks;
    }

    public function hasAttribute($name): bool
    {
        return isset($this->attributes[$name]);
    }

    public function getAttribute($name)
    {
        return $this->attributes[$name];
    }

    /**
     * Returns the unqualified, or short name, of the block without the namespace.
     *
     * @return string
     */
    public function getShortName(): string
    {
        return substr($this->name, strpos($this->name, '/') + 1);
    }

    /**
     * @param       $name
     * @param array $attributes
     * @param array $innerBlocks
     *
     * @return BlockModel
     */
    public static function make( array $blockData ): BlockModel
    {
        return new BlockModel(
            $blockData['name'],
            $blockData['attributes'] ?? [],
            BlockCollection::make($blockData['innerBlocks'] ?? [])
        );
    }
}
