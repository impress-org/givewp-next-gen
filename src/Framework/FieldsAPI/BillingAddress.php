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
                Select::make('country')
                    ->label('Country')
                    //->options(give_get_country_list())
                    ->options([
                        ['value' => 'BR', 'label' => 'Brazil'],
                        ['value' => 'US', 'label' => 'United States'],
                    ])
                    ->required(),
                Text::make('addressLine1')
                    ->label('Address Line 1')
                    ->required(),

                Text::make('addressLine2')
                    ->label('Address Line 2')
            );
    }
}
