<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class Authentication extends Field
{
    const TYPE = 'authentication';

    protected $required = true;

    public function required($value = true): self
    {
        $this->required = $value;
        return $this;
    }
}
