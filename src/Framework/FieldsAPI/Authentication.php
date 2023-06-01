<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class Authentication extends Group
{
    const TYPE = 'authentication';

    protected $required = false;
    protected $isAuthenticated = false;
    protected $loginRedirect = false;
    protected $loginRedirectUrl;
    protected $loginNotice;
    protected $loginConfirmation;

    public static function make($name)
    {
        return parent::make($name)
            ->append(
                Text::make('login')
                    ->label(__('Login', 'givewp'))
            )
            ->append(
                Text::make('password') // @todo Add Password field type
                ->label(__('Password', 'givewp'))
            );
    }

    public function required($value = true): self
    {
        $this->required = $value;
        return $this;
    }

    public function isAuthenticated($value = true): self
    {
        $this->isAuthenticated = $value;
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