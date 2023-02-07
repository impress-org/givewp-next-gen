import {useMemo} from 'react';
import type {AmountProps} from '@givewp/forms/propTypes';
import FixedAmountMessage from './FixedAmountMessage';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';

/**
 * @unreleased add support for allowing levels and fixed amount
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
                               }: AmountProps) {
    const {useWatch, useFormContext} = window.givewp.form.hooks;
    const {setValue} = useFormContext();
    const currency = useWatch({name: 'currency'});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );
    const currencySymbol = formatter.formatToParts().find(({type}) => type === 'currency').value;

    const isFixedAmount = !allowLevels;
    const displayFixedAmountMessage = !allowCustomAmount && isFixedAmount;

    return (
        <>
            <div className="givewp-fields-amount__directions">
                <label
                    className="givewp-fields-amount__input--label"
                    htmlFor={name}
                    aria-labelledby={name}
                >
                    <Label/>
                </label>

                {/* TODO: Control currency input from here*/}
                <span className="givewp-fields-amount__currency--container">
                    <span>{currency}</span>
                    <span>{currencySymbol}</span>
                </span>
            </div>

            {allowLevels && (
                <AmountLevels
                    name={name}
                    currency={currency}
                    levels={levels}
                    onLevelClick={(levelAmount) => {
                        setValue('amount-custom', null);
                        setValue(name, levelAmount);
                    }}
                />
            )}

            {allowCustomAmount && (
                <CustomAmount
                    fieldError={fieldError}
                    defaultValue={isFixedAmount ? fixedAmountValue : null}
                    currencySymbol={currencySymbol}
                />
            )}

            {displayFixedAmountMessage && (
                <FixedAmountMessage
                    amount={formatter.format(Number(fixedAmountValue))}
                />
            )}

            <input
                type="hidden"
                {...inputProps}
            />

            <ErrorMessage/>
        </>
    );
}
