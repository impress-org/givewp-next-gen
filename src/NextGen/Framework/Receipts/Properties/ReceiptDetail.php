<?php

namespace Give\NextGen\Framework\Receipts\Properties;

use Give\Framework\Support\Contracts\Arrayable;

class ReceiptDetail implements Arrayable {
    /**
     * @var string
     */
    public $label;
    /**
     * @var string
     */
    public $value;

    /**
     * @param string $label
     * @param mixed $value
     *
     * @unreleased
     */
    public function __construct(string $label, $value) {
        $this->label = $label;
        $this->value = $value;
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return [
            'label' => $this->label,
            'value' => $this->value,
        ];
    }
}
