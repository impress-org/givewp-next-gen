import {CurrencySetting} from "@givewp/forms/types";
import {ChangeEvent} from "react";

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
export const getCurrencySetting = (currency: string, currencySettings: CurrencySetting[]): CurrencySetting | undefined => {
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
 * The currency select and static component
 *
 * @unreleased
 */
export default function Currency({
    defaultCurrency,
    currencyOptions,
    onSelect,
}: {
    defaultCurrency: CurrencyOption;
    currencyOptions?: CurrencyOption[];
    onSelect?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
    if (currencyOptions.length > 0) {
        return (
            <span className="givewp-fields-amount__currency-select-container">
                <select
                    className="givewp-fields-amount__currency-select"
                    onChange={onSelect}
                    defaultValue={defaultCurrency.id}
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

    return (
        <span className="givewp-fields-amount__currency-container">
            <span>{defaultCurrency.id}</span>
            <span>{defaultCurrency.symbol}</span>
        </span>
    );
}