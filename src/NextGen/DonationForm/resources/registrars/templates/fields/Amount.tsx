import {useMemo} from 'react';
import classNames from 'classnames';
import type {AmountProps} from '@givewp/forms/propTypes';
import {__} from "@wordpress/i18n";

export default function Amount({
                                   name,
                                   defaultValue,
                                   Label,
                                   ErrorMessage,
                                   inputProps,
                                   fieldError,
                                   allowLevels,
                                   levels,
                                   allowCustomAmount,
                               }: AmountProps) {
    const {useWatch, useFormContext} = window.givewp.form.hooks;
    const currency = useWatch({name: 'currency'});
    const {setValue, register} = useFormContext();
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

    return (
        <>
            {allowLevels && (
                <AmountButtons name={name} currency={currency} levels={levels}/>
            )}
            <div className="givewp-fields-amount__amount--container">
                <label
                    className="givewp-fields-amount__input--label"
                    htmlFor={name}
                    aria-labelledby={name}
                    style={{display: 'none'}}
                >
                    <Label/>
                </label>
                <div className={classNames('givewp-fields-amount__input--container', {invalid: fieldError})}>
                    <span className="givewp-fields-amount__input--currency-symbol">
                        {formatter.formatToParts().find(({type}) => type === 'currency').value}
                    </span>
                    {allowCustomAmount && (
                        <input
                            {...register("amount-custom")}
                            className="givewp-fields-amount__input givewp-fields-amount__input--custom"
                            type="text"
                            aria-invalid={fieldError ? 'true' : 'false'}
                            id="amount-custom"
                            name="amount-custom"
                            inputMode="numeric"
                            placeholder={__('Enter custom amount', 'give')}
                            //defaultValue={defaultValue}
                            onChange={(event) => setValue(name, event.target.value)}
                        />
                    )}
                    <input
                        type="hidden"
                        {...inputProps}
                    />
                </div>

                <ErrorMessage />
            </div>
        </>
    );
}

function AmountButtons({name, currency, levels}: {name: string; currency: string; levels: Number[]}) {
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
