<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class Authentication extends Field
{
    const TYPE = 'authentication';

    protected $required = false;
    protected $loginRedirect = false;
    protected $loginRedirectUrl;
    protected $loginNotice;
    protected $loginConfirmation;

    public function required($value = true): self
    {
        $this->required = $value;
        return $this;
    }

    public function loginRedirect($value = true): self
    {
        $this->loginRedirect = $value;
        return $this;
    }

    public function loginRedirectUrl($value): self
    {
        $this->loginRedirectUrl = $value;
        return $this;
    }

    public function loginNotice($value): self
    {
        $this->loginNotice = $value;
        return $this;
    }

    public function loginConfirmation($value): self
    {
        $this->loginConfirmation = $value;
        return $this;
    }
}
