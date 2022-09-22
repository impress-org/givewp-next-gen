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
    /**
     * @unreleased
     * @return void
     */
    public function testHasName()
    {
        $block = BlockModel::make([
            'name' => 'namespace/block-name',
        ]);

        $this->assertEquals('namespace/block-name', $block->name);
        $this->assertEquals('block-name', $block->getShortName());
    }

    /**
     * @unreleased
     * @return void
     */
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

    /**
     * @unreleased
     * @return void
     */
    public function testHasInnerBlocksCollection()
    {
        $block = BlockModel::make([
            'name' => 'namespace/block-name',
            'innerBlocks' => [
                [
                    'name' => 'namespace/nested-block'
                ]
            ]
        ]);

        $this->assertInstanceOf(BlockCollection::class, $block->innerBlocks);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function testBlockModelReturnsArray()
    {
        $blockModel = new BlockModel('namespace/block', ['title' => 'My Block'], new BlockCollection([
            new BlockModel('namespace/inner-block', ['title' => 'My Inner Block'])
        ]));

        $this->assertSame(
            [
                'name' => 'namespace/block',
                'clientId' => 'namespace/block',
                'attributes' => [
                    'title' => 'My Block'
                ],
                'innerBlocks' => [
                    [
                        'name' => 'namespace/inner-block',
                        'clientId' => 'namespace/inner-block',
                        'attributes' => [
                            'title' => 'My Inner Block'
                        ],
                        'innerBlocks' => [
                        ]
                    ]
                ]
            ],
            $blockModel->toArray()
        );
    }
}
