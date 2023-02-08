import classNames from 'classnames';
import {__} from "@wordpress/i18n";
import CurrencyInput from "react-currency-input-field";
import {forwardRef} from "@wordpress/element";
import {ForwardedRef} from "react";

/**
 * @unreleased
 */
type CustomAmountProps = {
    fieldError?: string;
    currency?: string;
    currencySymbol?: string;
    defaultValue?: number;
    onValueChange?: (value: string) => void;
}

/**
 * @unreleased
 */
const CustomAmount = forwardRef(({
                                     defaultValue,
                                     fieldError,
                                     currency,
                                     currencySymbol,
                                     onValueChange,
                                 }: CustomAmountProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <div className={classNames('givewp-fields-amount__input--container', {invalid: fieldError})}>
            {currencySymbol && !currency && (
                <span className="givewp-fields-amount__input--currency-symbol">
                    {currencySymbol}
                </span>
            )}
            <CurrencyInput
                ref={ref}
                intlConfig={{
                    locale: navigator.language, currency,
                }}
                className="givewp-fields-amount__input givewp-fields-amount__input--custom"
                aria-invalid={fieldError ? 'true' : 'false'}
                id="amount-custom"
                name="amount-custom"
                placeholder={__('Enter custom amount', 'give')}
                defaultValue={defaultValue}
                decimalsLimit={2}
                onValueChange={(value, name) => {
                    onValueChange(value);
                }}
                customInput={forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
                    return <input {...props} ref={ref}/>
                })}
            />
        </div>
    );
});

export default CustomAmount;