import CurrencyInput, {formatValue} from "react-currency-input-field";

const {
    symbol = '$',
    currency = 'USD',
} = window.giveCurrency ?? {};

const Currency = ({amount, prefix, locale}) => {
    return formatValue({
        value: amount,
        prefix: prefix ?? symbol, // @note prefix overrides intlConfig
        intlConfig: {locale: locale ?? window.navigator.language},
    });

};

const CurrencyControl = (props) => {
    return (
        <div style={{position: 'relative'}}>
            <div
                style={{
                    position: 'absolute',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '13px',
                    fontSize: '.8em',
                }}>
                <span style={{marginBottom: '1px'}}>{symbol}</span>
            </div>
            <CurrencyInput
                {...props}
                style={{
                    ...props.style,
                    width: '140px',
                    padding: '6px 0 6px 30px',
                }}
                allowDecimals={true}
                allowNegativeValue={false}
                maxLength={9}
                intlConfig={{locale: window.navigator.language}}
            />
        </div>
    );
};

export {
    symbol,
    currency,
    Currency,
    CurrencyControl,
};
