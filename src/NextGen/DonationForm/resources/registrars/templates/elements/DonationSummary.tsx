import {ReactElement, useMemo} from 'react';
import {__} from '@wordpress/i18n';

/**
 * @since 0.3.3 update subscription frequency label
 * @since 0.1.0
 */
export default function DonationSummary() {
    const {useDonationSummary, useWatch, useCurrencyFormatter} = window.givewp.form.hooks;
    const currency = useWatch({name: 'currency'});
    const formatter = useCurrencyFormatter(currency);
    const {items, totals} = useDonationSummary();
    const coreItems = ['amount', 'frequency', 'total'];
    const amountItem = items.find((item) => item.id === 'amount');
    const frequencyItem = items.find((item) => item.id === 'frequency');
    const donationTotal = useMemo(
        () =>
            Object.values(totals).reduce((total: number, amount: number) => {
                return total + amount;
            }, 0),
        [totals]
    );

    // TODO: determine how to handle sorting items or do it this way
    return (
        <ul className="givewp-elements-donationSummary__list">
            {amountItem && <LineItem id={amountItem.id} label={amountItem.label} value={amountItem.value} />}
            {frequencyItem && (
                <LineItem id={frequencyItem.id} label={frequencyItem.label} value={frequencyItem.value} />
            )}

            {items
                .filter(({id}) => !coreItems.includes(id))
                .map(({id, label, value, description}, index) => {
                    return <LineItem id={id} label={label} value={value} description={description} key={index} />;
                })}

            <LineItem
                id={'total'}
                label={__('Donation Total', 'give')}
                value={formatter.format(Number(donationTotal))}
            />
        </ul>
    );
}

/**
 * @unreleased
 */
export type DonationSummaryLineItem = {
    id: string;
    label: string;
    value: string | ReactElement;
    description?: string | ReactElement;
};

/**
 * @since 0.1.0
 */
const LineItem = ({id, label, value, description}: DonationSummaryLineItem) => {
    return (
        <li className="givewp-elements-donationSummary__list-item">
            <div id={id} className="givewp-elements-donationSummary__list-item-label">{label}</div>
            <div id={id} className="givewp-elements-donationSummary__list-item-value">{value}</div>
            <div id={id} className="givewp-elements-donationSummary__list-item-description">{description}</div>
        </li>
    );
};
