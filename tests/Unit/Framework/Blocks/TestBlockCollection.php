<?php

namespace TestsNextGen\Unit\Framework\Blocks;

use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;
use GiveTests\TestCase;

/**
 * @unreleased
 */
class TestBlockCollection extends TestCase
{
    /**
     * @unreleased
     *
     * @return void
     */
    public function testMakesCollectionFromArray()
    {
        $blockModel = new BlockModel('namespace/nested-block', []);
        $collection = BlockCollection::make([
            $blockModel
        ]);

        $this->assertInstanceOf(BlockModel::class, $collection[0]);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function testMakesCollectionFromJson()
    {
        $collection = BlockCollection::fromJson('[{"name":"namespace/nested-block"}]');

        $this->assertInstanceOf(BlockModel::class, $collection[0]);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function testCollectionReturnsArray()
    {
        $collection = BlockCollection::fromJson('[{"name":"namespace/nested-block"}]');

        $blockModel = new BlockModel('namespace/nested-block', [], []);

        $this->assertSame(
            [
                $blockModel->toArray()
            ],
            $collection->toArray()
        );
    }
}
