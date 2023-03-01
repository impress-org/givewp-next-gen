import {DonationAmountProps} from '@givewp/forms/propTypes';

export default function DonationAmount({
    fields: {
        amount: Amount,
        donationType: DonationType,
        currency: Currency,
        subscriptionPeriod: SubscriptionPeriod,
        subscriptionInstallments: SubscriptionInstallments,
        subscriptionFrequency: SubscriptionFrequency,
    },
}: DonationAmountProps) {
    return (
        <>
            <Amount />
            <DonationType />
            <Currency />
            <SubscriptionPeriod />
            <SubscriptionFrequency />
            <SubscriptionInstallments />
        </>
    );
}
