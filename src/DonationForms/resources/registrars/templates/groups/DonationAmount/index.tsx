import {DonationAmountProps} from '@givewp/forms/propTypes';
import DonationAmountMessage from './DonationAmountMessage';
import useDonationType from './useDonationType';
import DonationAmountCurrencySwitcherMessage from './DonationAmountCurrencySwitcherMessage';

/**
 * @since 0.3.0
 */
export default function DonationAmount({
    fields: {
        amount: AmountField,
        donationType: DonationTypeField,
        currency: CurrencyField,
        subscriptionPeriod: SubscriptionPeriodField,
        subscriptionInstallments: SubscriptionInstallmentsField,
        subscriptionFrequency: SubscriptionFrequencyField,
    },
    fieldProps: {amount: amountProps},
    subscriptionsEnabled,
    subscriptionDetailsAreFixed,
}: DonationAmountProps) {
    useDonationType();
    const {allowLevels, fixedAmountValue, allowCustomAmount, currencySettings} = amountProps;

    return (
        <>
            {subscriptionsEnabled && <SubscriptionPeriodField />}
            <CurrencyField />
            <DonationTypeField />
            <AmountField>
                <DonationAmountMessage
                    isFixedAmount={!allowCustomAmount && !allowLevels}
                    fixedAmountValue={fixedAmountValue}
                    subscriptionDetailsAreFixed={subscriptionDetailsAreFixed}
                />
                {currencySettings.length > 1 && (
                    <DonationAmountCurrencySwitcherMessage
                        currencySettings={currencySettings}
                        message={
                            'The current exchange rate is 1.00 {base_currency} equals {new_currency_rate} {new_currency}.'
                        }
                    />
                )}
            </AmountField>
            {subscriptionsEnabled && <SubscriptionFrequencyField />}
            {subscriptionsEnabled && <SubscriptionInstallmentsField />}
        </>
    );
}
