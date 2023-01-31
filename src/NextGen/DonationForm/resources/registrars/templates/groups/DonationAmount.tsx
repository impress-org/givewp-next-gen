import {DonationAmountProps} from "@givewp/forms/propTypes";

export default function DonationAmount({fields: {amount: Amount, period: Period, times: Times, frequency: Frequency}}: DonationAmountProps) {
    return (
        <>
            <Amount />
            <Period />
            <Frequency />
            <Times />
        </>
    );
}
