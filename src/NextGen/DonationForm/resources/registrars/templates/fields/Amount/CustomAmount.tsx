import classNames from 'classnames';
import {__} from "@wordpress/i18n";
import CurrencyInput from "react-currency-input-field";
import {forwardRef} from "@wordpress/element";

/**
 * @unreleased
 */
type CustomAmountProps = {
    fieldError?: string;
    currencySymbol: string;
    defaultValue?: number;
    onValueChange?: (value: string) => void;
}

/**
 * @unreleased
 */
const CustomAmount = forwardRef(({
                                     defaultValue,
                                     fieldError,
                                     currencySymbol,
                                     onValueChange,
                                 }: CustomAmountProps, inputRef) => {
    return (
        <div className={classNames('givewp-fields-amount__input--container', {invalid: fieldError})}>
                <span className="givewp-fields-amount__input--currency-symbol">
                    {currencySymbol}
                </span>
            <CurrencyInput
                intlConfig={{locale: navigator.language}}
                className="givewp-fields-amount__input givewp-fields-amount__input--custom"
                aria-invalid={fieldError ? 'true' : 'false'}
                id="amount-custom"
                name="amount-custom"
                placeholder={__('Custom amount', 'give')}
                defaultValue={defaultValue}
                decimalsLimit={2}
                onValueChange={(value, name) => {
                    onValueChange(value);
                }}
                customInput={forwardRef((props, ref) => {
                    return <input {...props} ref={inputRef}/>
                })}
            />
        </div>
    );
});

export default CustomAmount;