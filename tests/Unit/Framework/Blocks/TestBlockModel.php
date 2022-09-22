<?php

namespace TestsNextGen\Unit\Framework\Blocks;

use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use GiveTests\TestCase;

/**
 * @unreleased
 */
class TestBlockModel extends TestCase
{
    public function testHasName()
    {
        $block = BlockModel::make([
            'name' => 'namespace/block-name',
        ]);

        $this->assertEquals('namespace/block-name', $block->name);
        $this->assertEquals('block-name', $block->getShortName());
    }

    public function testHasAttributes()
    {
        $block = BlockModel::make([
            'name' => 'namespace/block-name',
            'attributes' => [
                'foo' => 'bar'
            ],
        ]);

        $this->assertTrue($block->hasAttribute('foo'));
        $this->assertEquals('bar', $block->getAttribute('foo'));
    }

    public function testHasInnerBlocksCollection()
    {
        $block = BlockModel::make([
            'name' => 'namespace/block-name',
            'innerBlocks' => [[
                'name' => 'namespace/nested-block'
            ]]
        ]);

        $this->assertInstanceOf(BlockCollection::class, $block->innerBlocks);
    }
}
