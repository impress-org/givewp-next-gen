import {useMemo} from 'react';

export default function Amount({name, label, inputProps, levels, allowCustomAmount, fieldError}) {
    const {useFormContext, useWatch} = window.givewp.form;
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

    return (
        <div>
            <label>
                {label}
                <input type={allowCustomAmount ? 'text' : 'hidden'} {...inputProps} />
            </label>
            {levels.map((levelAmount) => {
                const label = formatter.format(levelAmount);
                return (
                    <button type="button" onClick={() => setValue(name, levelAmount)} key={label}>
                        {label}
                    </button>
                );
            })}
            {fieldError && <p>{fieldError}</p>}
        </div>
    );
}
