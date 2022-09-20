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
    public function testMakesCollectionFromArray()
    {
        $collection = BlockCollection::make([[
            'name' => 'namespace/nested-block'
        ]]);

        $this->assertInstanceOf(BlockModel::class, $collection[0]);
    }

    public function testMakesCollectionFromJson()
    {
        $collection = BlockCollection::fromJson('[{"name":"namespace/nested-block"}]');

        $this->assertInstanceOf(BlockModel::class, $collection[0]);
    }

    public function testCollectionIsSerializable()
    {
        $blocksJson = '[{"name":"namespace\/nested-block","attributes":[],"innerBlocks":{}}]';
        $collection = BlockCollection::fromJson($blocksJson);

        $this->assertEquals($blocksJson, $collection->toJson());
    }
}
