<?php

namespace Give\Tests\Unit\DataTransferObjects;

use Give\DonationForm\Blocks\DonationFormBlock\DataTransferObjects\BlockAttributes;
use Give\Tests\TestCase;

/**
 * @since 0.1.0
 */
class BlockAttributesTest extends TestCase
{

    /**
     * @since 0.1.0
     *
     * @return void
     */
    public function testShouldReturnAttributesArray()
    {
        $blockAttributes = BlockAttributes::fromArray([
            'formId' => 1,
            'blockId' => '123',
        ]);

        $this->assertSame(['formId' => 1, 'blockId' => '123'], $blockAttributes->toArray());
    }

    /**
     * @since 0.1.0
     *
     * @return void
     */
    public function testFormIdShouldReturnIntFromString()
    {
      $blockAttributes = BlockAttributes::fromArray([
          'formId' => '1',
          'blockId' => '123'
      ]);

        $this->assertSame(1, $blockAttributes->formId);
    }

}
