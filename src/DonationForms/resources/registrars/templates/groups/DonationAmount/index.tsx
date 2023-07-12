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
    const {allowLevels, fixedAmountValue, allowCustomAmount, currencySettings, currencySwitcherMessage} = amountProps;

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
                        message={currencySwitcherMessage}
                    />
                )}
            </AmountField>
            {subscriptionsEnabled && <SubscriptionFrequencyField />}
            {subscriptionsEnabled && <SubscriptionInstallmentsField />}
        </>
    );
}
