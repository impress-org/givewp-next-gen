<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class Name extends Group
{
    const TYPE = 'name';

    public static function make($name)
    {
        return parent::make($name)
            ->append(
                Text::make('firstName')
                    ->label('First Name')
                    ->required(),

                Text::make('lastName')
                    ->label('Last Name'),

                Select::make('honorific')
                    ->label('Honorific')
                    ->options('Mr.', 'Mrs.', 'Ms.')
            );
    }

    public function tap(callable $callback)
    {
        call_user_func(
            $callback,
            $this->getNodeByName('firstName'),
            $this->getNodeByName('lastName'),
            $this->getNodeByName('honorific'),
            $this
        );

        return $this;
    }
}
