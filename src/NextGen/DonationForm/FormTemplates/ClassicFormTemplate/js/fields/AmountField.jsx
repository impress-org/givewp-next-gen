import {__} from '@wordpress/i18n';
import {useMemo} from 'react';

export default function Amount({name, label, inputProps, levels, allowCustomAmount, fieldError}) {
    const {useFormContext, useWatch} = window.givewp.form;
    const {setValue} = useFormContext();
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

            <div className="givewp-amount-input-container">
                    <span
                        className="givewp-currency-symbol">{formatter.formatToParts().find(({type}) => type === 'currency').value}</span>
                <input type={allowCustomAmount ? 'text' : 'hidden'} inputMode={'decimal'} {...inputProps} />
            </div>

            <div className="givewp-amount-levels-container">
                {levels.map((levelAmount) => {
                    const label = formatter.format(levelAmount);
                    const selected = levelAmount === Number(amount);
                    return (
                        <button className={`givewp-amount-level ${selected ? 'selected' : ''}`} type="button"
                                onClick={() => setValue(name, levelAmount)} key={label}>
                            {label}
                        </button>
                    );
                })}

                <button
                    className={`givewp-amount-level givewp-amount-level-custom ${!levels.includes(Number(amount)) ? 'selected' : ''}`}
                    type="button"
                    onClick={() => setValue(name, null)} key='custom'>
                    {__('Custom Amount', 'give')}
                </button>
            </div>

            {fieldError && <p>{fieldError}</p>}
        </div>
    );
}
