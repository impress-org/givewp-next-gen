<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

/**
 * @unreleased
 */
class BillingAddress extends Group
{
    const TYPE = 'billingAddress';

    /**
     * @unreleased
     *
     * @throws Exceptions\EmptyNameException|Exceptions\NameCollisionException
     */
    public static function make($name): BillingAddress
    {
        $countryList = [];
        foreach (give_get_country_list() as $value => $label) {
            $countryList[] = [$value, $label];
        }

        return parent::make($name)
            ->append(
                Select::make('country')
                    ->label(__('Country', 'give'))
                    ->options($countryList)
                    ->required(),

                Text::make('address1')
                    ->label(__('Address Line 1', 'give'))
                    ->required(),

                Text::make('address2')
                    ->label(__('Address Line 2', 'give')),

                Text::make('city')
                    ->label(__('City', 'give'))
                    ->required(),

                Text::make('state')
                    ->label(__('State/Province/Country', 'give'))
                    ->required(),

                Text::make('zip')
                    ->label(__('Zip/Postal Code', 'give'))
                    ->required()
            );
    }
}
