import {CurrencySetting} from '@givewp/forms/types';
import {ChangeEvent, useMemo} from 'react';
import amountFormatter from '@givewp/forms/app/utilities/amountFormatter';
import {__} from '@wordpress/i18n';

/**
 * @unreleased
 */
const convertCurrencySettingsToOptions = (currencySettings: CurrencySetting[]): CurrencyOption[] => {
    return currencySettings.map(({id}) => {
        const formatter = amountFormatter(id);
        const symbol = formatter.formatToParts().find(({type}) => type === 'currency').value;

        return {
            id,
            symbol,
        };
    });
};

/**
 * @unreleased
 */
export type CurrencyOption = {
    id: string;
    symbol: string;
};

/**
 * Find the currency setting by currency id
 *
 * @unreleased
 */
export const getCurrencySetting = (
    currency: string,
    currencySettings: CurrencySetting[]
): CurrencySetting | undefined => {
    return currencySettings.find(({id}) => id === currency);
};

/**
 * @unreleased
 */
export const isBaseCurrency = (currencySetting: CurrencySetting) => currencySetting.exchangeRate === 0;

/**
 * Calculate the amount based on the currency exchange rate, taking into account the from and to currency values
 *
 * @unreleased
 */
export const calculateCurrencyAmount = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    currencySettings: CurrencySetting[]
): number => {
    const fromCurrencySetting = getCurrencySetting(fromCurrency, currencySettings);
    const toCurrencySetting = getCurrencySetting(toCurrency, currencySettings);

    // convert from currency to base amount by dividing by the current exchange rate
    // make sure to round the amount to avoid floating point issues
    if (fromCurrencySetting !== undefined && !isBaseCurrency(fromCurrencySetting)) {
        amount = Math.round(amount / fromCurrencySetting.exchangeRate);
    }

    // convert to next currency by multiplying by the next exchange rate
    if (toCurrencySetting !== undefined && !isBaseCurrency(toCurrencySetting)) {
        amount = amount * toCurrencySetting.exchangeRate;
    }

    return amount;
};

/**
 * @unreleased
 */
type CurrencySwitcherProps = {
    defaultCurrency: string;
    currencySettings: CurrencySetting[];
    onSelect?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * The currency select and static component
 *
 * @unreleased
 */
function CurrencySwitcher({defaultCurrency, currencySettings, onSelect}: CurrencySwitcherProps) {
    const currencyOptions = useMemo(
        () => convertCurrencySettingsToOptions(currencySettings),
        [JSON.stringify(currencySettings)]
    );

    return (
        <span className="givewp-fields-amount__currency-select-container">
            <select
                className="givewp-fields-amount__currency-select"
                onChange={onSelect}
                defaultValue={defaultCurrency}
            >
                {currencyOptions.map((option) => {
                    return (
                        <option key={option.id} value={option.id}>
                            {option.id} {option.symbol}
                        </option>
                    );
                })}
            </select>
        </span>
    );
}

function CurrencySwitcherMessage({
    message,
    baseCurrency,
    newCurrencyRate,
    newCurrency,
}: {
    message: string;
    baseCurrency: string;
    newCurrencyRate: string;
    newCurrency: string;
}) {
    if (baseCurrency === newCurrency) {
        return;
    }

    const templateTags = {
        base_currency: baseCurrency,
        new_currency_rate: newCurrencyRate,
        new_currency: newCurrency,
    };

    Object.keys(templateTags).forEach((key) => {
        message = message.replace(`{${key}}`, templateTags[key]);
    });

    return <div>{__(message, 'give')}</div>;
}

CurrencySwitcher.Message = CurrencySwitcherMessage;
export default CurrencySwitcher;
