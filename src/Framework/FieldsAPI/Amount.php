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
    protected $customAmountText;

    /**
     * @var bool
     */
    protected $allowCustomAmount = false;
    /**
     * @var bool
     */
    protected $allowLevels = false;

    /**
     * @var int
     */
    protected $fixedAmountValue;
    /**
     * @var array
     */
    protected $attributes;

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
     * @unreleased
     */
    public function allowLevels($allow = true): self
    {
        $this->allowLevels = $allow;

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
     */
    public function customAmountText(string $customAmountText): Amount
    {
        $this->customAmountText = $customAmountText;

        return $this;
    }

    /**
     * @unreleased
     */
    public function attributes(array $array): Amount
    {
        $this->attributes = $array;

        return $this;
    }

    /**
     * @unreleased
     */
    public function fixedAmountValue(int $amount): Amount
    {
        $this->fixedAmountValue = $amount;

        return $this;
    }
}
