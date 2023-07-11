import {useCallback} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';
import {useState} from 'react';
import CurrencySwitcher, {calculateCurrencyAmount} from './CurrencySwitcher';

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
            <div className="givewp-fields-amount__input-label-container">
                <label className="givewp-fields-amount__input-label" htmlFor={name} aria-labelledby={name}>
                    <Label />
                </label>

                {currencySettings.length > 1 ? (
                    <CurrencySwitcher
                        defaultCurrency={currency}
                        currencySettings={currencySettings}
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
                ) : (
                    <span className="givewp-fields-amount__currency-container">
                        <span>{currency}</span>
                        <span>{currencySymbol}</span>
                    </span>
                )}
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

            {/*TODO: Update Message and baseCurrency to be dynamic from settings */}
            <CurrencySwitcher.Message
                message={'The current exchange rate is 1.00 {base_currency} equals {new_currency_rate} {new_currency}.'}
                baseCurrency={'USD'}
                newCurrencyRate={
                    currencySettings.find((setting) => setting.id === currency)?.exchangeRate.toFixed(2) ?? '1.00'
                }
                newCurrency={currency}
            />

            <ErrorMessage />
        </>
    );
}
