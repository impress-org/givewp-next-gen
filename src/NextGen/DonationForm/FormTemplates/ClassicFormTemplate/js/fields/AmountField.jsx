import {__} from '@wordpress/i18n';
import {useMemo} from 'react';
import classNames from 'classnames';

export default function AmountField({name, label, inputProps, levels, allowCustomAmount, fieldError}) {
    const {useFormContext, useWatch} = window.givewp.form;
    const {setValue, setFocus} = useFormContext();
    const currency = useWatch({name: 'currency'});
    const amount = useWatch({name: 'amount'});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

    return (
        <div className="givewp-fields-amount-container">
            {label &&
                <label>
                    {label}
                </label>
            }

            <div>
                <div className={classNames("givewp-amount-input-container", {'invalid': fieldError})}>
                    <span
                        className="givewp-currency-symbol">{formatter.formatToParts().find(({type}) => type === 'currency').value}</span>
                    <input className='givewp-amount-input' type={allowCustomAmount ? 'text' : 'hidden'}
                           aria-invalid={fieldError ? "true" : "false"}
                           inputMode="numeric" {...inputProps} />
                </div>
                
                <div className="error-message">
                    {fieldError && <p role="alert">{fieldError}</p>}
                </div>
            </div>

            <div className="givewp-amount-levels-container">
                {levels.map((levelAmount) => {
                    const label = formatter.format(levelAmount);
                    const selected = levelAmount === Number(amount);
                    return (
                        <button className={classNames('givewp-amount-level', {'selected': selected})} type="button"
                                onClick={() => setValue(name, levelAmount)} key={label}>
                            {label}
                        </button>
                    );
                })}

                <button
                    className={
                        classNames(
                            'givewp-amount-level',
                            'givewp-amount-level-custom',
                            {'selected': !levels.includes(Number(amount))}
                        )
                    }
                    type="button"
                    onClick={() => {
                        setValue(name, null);
                        setFocus("amount", {shouldSelect: true})
                    }} key='custom'>
                    {__('Custom Amount', 'give')}
                </button>
            </div>
        </div>
    );
}
