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
    const {allowLevels, allowCustomAmount, currencySettings, currencySwitcherMessage} = amountProps;

    return (
        <>
            {subscriptionsEnabled && <SubscriptionPeriodField />}
            <CurrencyField />
            <DonationTypeField />
            <AmountField
                messages={
                    <>
                        <DonationAmountMessage
                            isFixedAmount={!allowCustomAmount && !allowLevels}
                            subscriptionDetailsAreFixed={subscriptionDetailsAreFixed}
                        />

                        {currencySettings.length > 1 && currencySwitcherMessage && (
                            <DonationAmountCurrencySwitcherMessage
                                currencySettings={currencySettings}
                                message={currencySwitcherMessage}
                            />
                        )}
                    </>
                }
            />
            {subscriptionsEnabled && <SubscriptionFrequencyField />}
            {subscriptionsEnabled && <SubscriptionInstallmentsField />}
        </>
    );
}
