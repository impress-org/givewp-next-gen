import {useEffect, useState} from '@wordpress/element';

/**
 * @unreleased
 */
type Period = {
    value: string;
    label: string;
};

/**
 * @unreleased
 */
type DonationPeriodProps = {
    periods: Period[]
}

/**
 * @unreleased
 */
export default function DonationPeriod({periods}: DonationPeriodProps) {
    const {useFormContext} = window.givewp.form.hooks;
    const [selectedPeriod, setSelectedPeriod] = useState(periods[0]?.value);
    const {setValue} = useFormContext();

    useEffect(() => {
        if (selectedPeriod === 'once'){
            setValue('donationType', 'donation');
            setValue('period', 'once');
            setValue('frequency', null);
        } else {
            setValue('donationType', 'subscription');
            setValue('period', selectedPeriod);
            setValue('frequency', 1);
        }
    }, [selectedPeriod]);

    return (
        <ul className="givewp-fields-amount__periods">
            {periods.map(({value, label}, index) => (
                <li key={index}>
                    <input type="radio" name="donationAmountPeriod" value={value} defaultChecked={index === 0} onChange={(event) => setSelectedPeriod(event.target.value)} />
                    <label htmlFor="donationAmountPeriod">{label}</label>
                </li>
            ))}
        </ul>
    );
}