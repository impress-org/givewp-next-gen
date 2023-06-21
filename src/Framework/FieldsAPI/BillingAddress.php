<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class BillingAddress extends Group
{
    const TYPE = 'billing-address';

    public static function make($name)
    {
        return parent::make($name)
            ->append(
                Text::make('addressLine1')
                    ->label('Address Line 1')
                    ->required(),

                Text::make('addressLine2')
                    ->label('Address Line 2')

            /*Select::make('honorific')
                ->label('Honorific')
                ->options('Mr.', 'Mrs.', 'Ms.')*/
            );
    }
}
