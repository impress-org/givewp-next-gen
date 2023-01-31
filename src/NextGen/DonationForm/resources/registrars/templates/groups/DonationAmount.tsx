import {DonationAmountProps} from "@givewp/forms/propTypes";

export default function DonationAmount({
                                           fields: {
                                               amount: Amount,
                                               donationType: DonationType,
                                               currency: Currency,
                                               period: Period,
                                               times: Times,
                                               frequency: Frequency
                                           }
                                       }: DonationAmountProps) {
    return (
        <>
            <Amount/>
            <DonationType/>
            <Currency/>
            <Period/>
            <Frequency/>
            <Times/>
        </>
    );
}
