import {useMemo} from 'react';
import classNames from 'classnames';
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
    const {useWatch} = window.givewp.form.hooks;
    const currency = useWatch({name: 'currency'});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

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
                    <span>{formatter.formatToParts().find(({type}) => type === 'currency').value}</span>
                </span>
            </div>

            {allowLevels && (
                <AmountLevels name={name} currency={currency} levels={levels}/>
            )}

            {allowCustomAmount && (
                <CustomAmount
                    fieldError={fieldError}
                    defaultValue={isFixedAmount ? fixedAmountValue : null}
                    currencySymbol={formatter.formatToParts().find(({type}) => type === 'currency').value}
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

function AmountButtons({name, currency, levels}: { name: string; currency: string; levels: Number[] }) {
    const {useFormContext, useWatch} = window.givewp.form.hooks;
    const {setValue, setFocus} = useFormContext();
    const amount = useWatch({name});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

    return (
        <div className="givewp-fields-amount__levels--container">
            {levels.map((levelAmount, index) => {
                const label = formatter.format(Number(levelAmount));
                const selected = levelAmount === Number(amount);
                return (
                    <button
                        className={classNames('givewp-fields-amount__level', {
                            'givewp-fields-amount__level--selected': selected,
                        })}
                        type="button"
                        onClick={() => {
                            setValue('amount-custom', null);
                            setValue(name, levelAmount);
                        }}
                        key={index}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
