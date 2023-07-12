import {useCallback} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';
import {useState} from 'react';

/**
 * @unreleased add currency settings
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
    children,
}: AmountProps) {
    const DonationAmountCurrency = window.givewp.form.templates.layouts.donationAmountCurrency;
    const [customAmountValue, setCustomAmountValue] = useState<string>('');
    const {useWatch, useFormContext} = window.givewp.form.hooks;
    const {setValue} = useFormContext();

    const currency = useWatch({name: 'currency'});

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

                <DonationAmountCurrency
                    currencySettings={currencySettings}
                    onCurrencyAmountChange={updateCustomAmount}
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

            {children}

            <ErrorMessage />
        </>
    );
}
