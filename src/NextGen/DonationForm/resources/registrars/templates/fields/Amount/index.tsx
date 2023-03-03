import {useEffect, useRef} from '@wordpress/element';
import type {AmountProps} from '@givewp/forms/propTypes';
import FixedAmountMessage from './FixedAmountMessage';
import CustomAmount from './CustomAmount';
import AmountLevels from './AmountLevels';
import FixedAmountRecurringMessage from './FixedAmountRecurringMessage';

/**
 * @unreleased add display options for multi levels, fixed amount, and custom amount
 * @since 0.1.0
 */
export default function Amount({
    name,
    defaultValue,
    Label,
    ErrorMessage,
    inputProps,
    fieldError,
    allowLevels,
    levels,
    fixedAmountValue,
    allowCustomAmount,
}: AmountProps) {
    const customAmountInputRef = useRef<HTMLInputElement>(null);
    const {useWatch, useFormContext, useCurrencyFormatter} = window.givewp.form.hooks;
    const {setValue} = useFormContext();
    //const amount = useWatch({name: 'amount'});
    const currency = useWatch({name: 'currency'});
    const donationPeriod = useWatch({name: 'period'});
    const subscriptionFrequency = useWatch({name: 'frequency'});
    const subscriptionInstallments = useWatch({name: 'installments'});
    const formatter = useCurrencyFormatter(currency);
    const currencySymbol = formatter.formatToParts().find(({type}) => type === 'currency').value;

    const isFixedAmount = !allowLevels;
    const displayFixedAmountMessage = !allowCustomAmount && isFixedAmount;
    const displayFixedAmountRecurringMessage =
        donationPeriod !== 'one-time' && (subscriptionFrequency > 1 || subscriptionInstallments > 0);
    const resetCustomAmountInput = () => {
        customAmountInputRef.current.value = '';
        customAmountInputRef.current.attributes.getNamedItem('value').value = '';
    };

    useEffect(() => {
        if (donationPeriod) {
            if (donationPeriod === 'one-time') {
                setValue('donationType', 'single');
            } else {
                setValue('donationType', 'subscription');
            }
        }
    }, [donationPeriod]);

    return (
        <>
            <div className="givewp-fields-amount__directions">
                <label className="givewp-fields-amount__input--label" htmlFor={name} aria-labelledby={name}>
                    <Label />
                </label>

                {/* TODO: Control currency input from here*/}
                <span className="givewp-fields-amount__currency--container">
                    <span>{currency}</span>
                    <span>{currencySymbol}</span>
                </span>
            </div>

            {allowLevels && (
                <AmountLevels
                    name={name}
                    currency={currency}
                    levels={levels}
                    onLevelClick={(levelAmount) => {
                        resetCustomAmountInput();
                        setValue(name, levelAmount);
                    }}
                />
            )}

            {allowCustomAmount && (
                <CustomAmount
                    ref={customAmountInputRef}
                    fieldError={fieldError}
                    defaultValue={isFixedAmount ? fixedAmountValue : null}
                    currency={currency}
                    currencySymbol={currencySymbol}
                    onValueChange={(value) => {
                        setValue(name, value ?? null);
                    }}
                />
            )}

            {displayFixedAmountMessage && !displayFixedAmountRecurringMessage && (
                <FixedAmountMessage amount={formatter.format(Number(fixedAmountValue))} />
            )}

            {displayFixedAmountRecurringMessage && (
                <FixedAmountRecurringMessage
                    isFixed={isFixedAmount && !allowCustomAmount}
                    fixedAmount={formatter.format(Number(fixedAmountValue))}
                    period={donationPeriod}
                    frequency={subscriptionFrequency}
                    installments={subscriptionInstallments}
                />
            )}

            <input type="hidden" {...inputProps} />

            <ErrorMessage />
        </>
    );
}
