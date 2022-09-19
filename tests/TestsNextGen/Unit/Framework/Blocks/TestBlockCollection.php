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
        $collection = BlockCollection::fromJson(
            json_encode('[["name" => "namespace/nested-block"]]')
        );

        $this->assertInstanceOf(BlockModel::class, $collection[0]);
    }
}
