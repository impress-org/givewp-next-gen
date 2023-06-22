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
                    ->label(__('Country', 'give'))
                    //->options(give_get_country_list())
                    ->options([
                        ['value' => 'BR', 'label' => 'Brazil'],
                        ['value' => 'US', 'label' => 'United States'],
                    ])
                    ->required(),

                Text::make('addressLine1')
                    ->label(__('Address Line 1', 'give'))
                    ->required(),

                Text::make('addressLine2')
                    ->label(__('Address Line 2', 'give')),

                Text::make('city')
                    ->label(__('City', 'give'))
                    ->required(),

                Text::make('state')
                    ->label(__('State/Province/Country', 'give'))
                    ->required(),

                Text::make('zipPostalCode')
                    ->label(__('Zip/Postal Code', 'give'))
                    ->required()
            );
    }
}
