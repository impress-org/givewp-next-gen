<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

use Give\Framework\FieldsAPI\Concerns\HasLabel;

class Amount extends Field
{
    use HasLabel;

    const TYPE = 'amount';

    /**
     * @var int[]
     */
    protected $levels = [];
    /**
     * @var string
     */
    protected $type;
    /**
     * @var string
     */
    protected $customAmountText;

    /**
     * @var bool
     */
    protected $allowCustomAmount = false;

    /**
     * Set the preset donation levels. Provide levels in minor units.
     *
     * @since 0.1.0
     */
    public function levels(int ...$levels): self
    {
        $this->levels = $levels;

        return $this;
    }

    /**
     * @since 0.1.0
     */
    public function getLevels(): array
    {
        return $this->levels;
    }

    /**
     * @since 0.1.0
     */
    public function allowCustomAmount($allow = true): self
    {
        $this->allowCustomAmount = $allow;

        return $this;
    }

    /**
     * @since 0.1.0
     */
    public function customAmountAllowed(): bool
    {
        return $this->allowCustomAmount;
    }

    /**
     * @unreleased
     *
     * @param  string  $type  - 'fixed' or 'multi'
     * TODO: make type a value object
     */
    public function type(string $type): Amount
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @unreleased
     */
    public function customAmountText(string $customAmountText): Amount
    {
        $this->customAmountText = $customAmountText;

        return $this;
    }
}
