import {useCallback} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import CustomAmount from './CustomAmount';
import {useState} from 'react';
import getAmountLevelsWithCurrencySettings from './getAmountLevelsWithCurrencySettings';
import DonationAmountCurrency from './DonationAmountCurrency';
import DonationAmountLevels from './DonationAmountLevels';

/**
 * @since 0.6.0 add currency settings
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
    messages,
}: AmountProps) {
    const [customAmountValue, setCustomAmountValue] = useState<string>('');
    const {useWatch, useFormContext, useDonationFormSettings} = window.givewp.form.hooks;
    const {setValue} = useFormContext();
    const {currencySwitcherSettings} = useDonationFormSettings();

    const currency = useWatch({name: 'currency'});

    const getAmountLevels = useCallback(() => {
        if (currencySwitcherSettings.length <= 1) {
            return levels;
        }

        return getAmountLevelsWithCurrencySettings(levels, currency, currencySwitcherSettings);
    }, [currency]);

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
                    currencySettings={currencySwitcherSettings}
                    onCurrencyAmountChange={updateCustomAmount}
                />
            </div>

            {allowLevels && (
                <DonationAmountLevels
                    name={name}
                    currency={currency}
                    levels={getAmountLevels()}
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

            {messages}

            <ErrorMessage />
        </>
    );
}
