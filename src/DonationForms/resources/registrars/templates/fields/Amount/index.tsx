import {useCallback} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';
import {CurrencySetting} from '@givewp/forms/types';
import {ChangeEvent, useState} from 'react';
import amountFormatter from '@givewp/forms/app/utilities/amountFormatter';

/**
 * @unreleased
 */
type Currency = {
    id: string;
    symbol: string;
};

/**
 * Find the currency setting by currency id
 *
 * @unreleased
 */
const getCurrencySetting = (currency: string, currencySettings: CurrencySetting[]): CurrencySetting | undefined => {
    return currencySettings.find(({id}) => id === currency);
};

/**
 * @unreleased
 */
const isBaseCurrency = (currencySetting: CurrencySetting) => currencySetting.exchangeRate === 0;

/**
 * Calculate the amount based on the currency exchange rate, taking into account the from and to currency values
 *
 * @unreleased
 */
const calculateCurrencyAmount = (
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
function Currency({
    defaultCurrency,
    currencyOptions,
    onSelect,
}: {
    defaultCurrency: Currency;
    currencyOptions?: Currency[];
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

/**
 * @since 0.2.0 add display options for multi levels, fixed amount, and custom amount
 * @since 0.1.0
 */
export default function Amount({
    name,
    defaultValue,
    Label,
    ErrorMessage,
    inputProps,
    fieldError,
    allowLevels,
    levels,
    fixedAmountValue,
    allowCustomAmount,
    currencySettings,
}: AmountProps) {
    const [customAmountValue, setCustomAmountValue] = useState<string>('');
    const {useWatch, useFormContext, useCurrencyFormatter} = window.givewp.form.hooks;
    const {setValue, getValues} = useFormContext();

    const getCurrencyOptions = useCallback((): Currency[] => {
        return currencySettings.map(({id}) => {
            const formatter = amountFormatter(id);
            const symbol = formatter.formatToParts().find(({type}) => type === 'currency').value;

            return {
                id,
                symbol,
            };
        });
    }, []);

    const currency = useWatch({name: 'currency'});

    const formatter = useCurrencyFormatter(currency);
    const currencySymbol = formatter.formatToParts().find(({type}) => type === 'currency').value;

    const isFixedAmount = !allowLevels;

    const resetCustomAmount = useCallback(() => {
        if (customAmountValue !== '') {
            setCustomAmountValue('');
        }
    }, [customAmountValue]);

    const updateCustomAmount = useCallback(
        (amount: number) => {
            if (customAmountValue !== '') {
                setCustomAmountValue(amount.toFixed(2));
            }
        },
        [customAmountValue]
    );

    return (
        <>
            <div className="givewp-fields-amount__directions">
                <label className="givewp-fields-amount__input--label" htmlFor={name} aria-labelledby={name}>
                    <Label />
                </label>

                <Currency
                    defaultCurrency={{id: currency, symbol: currencySymbol}}
                    currencyOptions={getCurrencyOptions()}
                    onSelect={(event) => {
                        const selectedCurrency = event.target.value;

                        const currencyAmount = calculateCurrencyAmount(
                            getValues('amount'),
                            currency,
                            selectedCurrency,
                            currencySettings
                        );

                        setValue('currency', selectedCurrency);
                        setValue('amount', currencyAmount);

                        updateCustomAmount(currencyAmount);
                    }}
                />
            </div>

            {allowLevels && (
                <AmountLevels
                    name={name}
                    currency={currency}
                    levels={levels}
                    currencySettings={currencySettings}
                    onLevelClick={(levelAmount) => {
                        resetCustomAmount();
                        setValue(name, levelAmount);
                    }}
                />
            )}

            {allowCustomAmount && (
                <CustomAmount
                    fieldError={fieldError}
                    defaultValue={isFixedAmount ? fixedAmountValue : null}
                    currency={currency}
                    value={customAmountValue}
                    onValueChange={(value) => {
                        setCustomAmountValue(value);

                        setValue(name, Number(value) ?? null);
                    }}
                />
            )}

            <input type="hidden" {...inputProps} />

            <ErrorMessage />
        </>
    );
}
