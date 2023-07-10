import {useCallback} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';
import {useState} from 'react';
import amountFormatter from '@givewp/forms/app/utilities/amountFormatter';
import Currency, {calculateCurrencyAmount, CurrencyOption} from './Currency';

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

    const getCurrencyOptions = useCallback((): CurrencyOption[] => {
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
