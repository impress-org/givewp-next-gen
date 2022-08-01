import {useMemo} from "react";

export default function DonationSummary() {

    const {useWatch} = window.givewp.form;
    const currency = useWatch({name: 'currency'});
    const amount = useWatch({name: 'amount'});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    )

    return <div>
        <ul className="givewp-elements-donationsummary__list">
            <LineItem label={'Payment Amount'} value={formatter.format(Number(amount))} />
            <LineItem label={'Giving Frequency'} value={'One time'} />
            <LineItem label={'Donation Total'} value={formatter.format(Number(amount))} />
        </ul>
    </div>;
}

const LineItem = ({label, value}) => {
    return (
        <li className="givewp-elements-donationsummary__list-item">
            <div>{label}</div>
            <div>{value}</div>
        </li>
    )
}
