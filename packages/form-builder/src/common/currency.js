import CurrencyInput, {formatValue} from 'react-currency-input-field';
import {BaseControl} from "@wordpress/components";

const {currency = 'USD'} = window?.storageData?.currency ?? {};

const Currency = ({amount}) => {
    return formatValue({
        value: amount,
        intlConfig: {locale: window.navigator.language, currency},
    });

};

const CurrencyControl = (props) => {
    return (
        <BaseControl id={'test'} label={ props.label }>
            <CurrencyInput
                {...props}
                className={"components-text-control__input"}
                allowDecimals={true}
                allowNegativeValue={false}
                maxLength={9}
                intlConfig={{locale: window.navigator.language, currency}}
            />
        </BaseControl>
    );
};

export {
    currency,
    Currency,
    CurrencyControl,
};
