import {DonationAmountProps} from '@givewp/forms/propTypes';

export default function DonationAmount({
    fields: {
        amount: Amount,
        donationType: DonationType,
        currency: Currency,
        period: Period,
        installments: Installments,
        frequency: Frequency,
    },
}: DonationAmountProps) {
    return (
        <>
            {Period && <Period />}
            <Amount />
            <DonationType />
            <Currency />
            {Frequency && <Frequency />}
            {Installments && <Installments />}
        </>
    );
}
