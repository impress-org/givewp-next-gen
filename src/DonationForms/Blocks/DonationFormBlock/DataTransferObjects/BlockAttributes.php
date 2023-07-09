<?php

namespace Give\DonationForms\Blocks\DonationFormBlock\DataTransferObjects;

use Give\Framework\Support\Contracts\Arrayable;

class BlockAttributes implements Arrayable
{
    /**
     * @var int|null
     */
    public $formId;
    /**
     * @var string
     */
    public $blockId;

    /**
     * @unrleased
     * @var string
     */
    public $formFormat;

    /**
     * @since 0.1.0
     */
    public static function fromArray(array $array): BlockAttributes
    {
        $self = new self();

        $self->formId = ! empty($array['formId']) ? (int)$array['formId'] : null;
        $self->blockId = ! empty($array['blockId']) ? (string)$array['blockId'] : null;
        $self->formFormat = ! empty($array['formFormat']) ? (string)$array['formFormat'] : null;

        return $self;
    }

    /**
     * @since 0.1.0
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
