<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class Amount extends Field
{
    const TYPE = 'amount';

    /**
     * @var int[]
     */
    protected $levels = [];

    /**
     * @var bool
     */
    protected $allowCustomAmount = false;

    public function levels(int ...$levels): self
    {
        $this->levels = $levels;

        return $this;
    }

    public function getLevels(): array
    {
        return $this->levels;
    }

    public function allowCustomAmount($allow = true): self
    {
        $this->allowCustomAmount = $allow;

        return $this;
    }

    public function customAmountAllowed(): bool
    {
        return $this->allowCustomAmount;
    }
}
