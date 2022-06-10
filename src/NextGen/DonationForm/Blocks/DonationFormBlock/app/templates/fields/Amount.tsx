import {FieldProps} from '../index';
import {useMemo} from 'react';
// import {useFormContext} from 'react-hook-form';

interface AmountProps extends FieldProps {
    levels: bigint[];
    allowCustomAmount: boolean;
}

export default function Amount({name, label, inputProps, levels, allowCustomAmount}: AmountProps) {
    const {useFormContext} = window.givewp.form;
    const {setValue, watch} = useFormContext();
    const currency = watch('currency');
    const formatter: Intl.NumberFormat = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

    return (
        <div>
            {levels.map((levelAmount) => {
                const label = formatter.format(levelAmount);
                return (
                    <button onClick={() => setValue(name, levelAmount)} key={label}>
                        {label}
                    </button>
                );
            })}
            <label>
                {label}
                <input type={allowCustomAmount ? 'text' : 'hidden'} {...inputProps} />
            </label>
        </div>
    );
}
