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
            {SubscriptionPeriod && <SubscriptionPeriod />}
            <Amount />
            <DonationType />
            <Currency />
            {SubscriptionFrequency && <SubscriptionFrequency />}
            {SubscriptionInstallments && <SubscriptionInstallments />}
        </>
    );
}
