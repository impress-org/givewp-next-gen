import classNames from 'classnames';
import {__} from "@wordpress/i18n";
import CurrencyInput from "react-currency-input-field";

/**
 * @unreleased
 */
export default function CustomAmount({
                          defaultValue,
                          fieldError,
                          currencySymbol,
                      }: { fieldError?: string, currencySymbol: string, defaultValue?: number }) {
    const {useFormContext} = window.givewp.form.hooks;
    const {setValue, register} = useFormContext();
    return (
        <div className={classNames('givewp-fields-amount__input--container', {invalid: fieldError})}>
                <span className="givewp-fields-amount__input--currency-symbol">
                    {currencySymbol}
                </span>
            <CurrencyInput
                {...register("amount-custom")}
                intlConfig={{locale: navigator.language}}
                className="givewp-fields-amount__input givewp-fields-amount__input--custom"
                aria-invalid={fieldError ? 'true' : 'false'}
                id="amount-custom"
                name="amount-custom"
                placeholder={__('Custom amount', 'give')}
                defaultValue={defaultValue}
                decimalsLimit={2}
                onValueChange={(value, name) => {
                    setValue('amount', value ?? null);
                }}
            />
        </div>
    );
}