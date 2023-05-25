import {__} from '@wordpress/i18n';
import useCurrencyFormatter from '@givewp/forms/app/hooks/useCurrencyFormatter';
import {isSubscriptionPeriod, SubscriptionPeriod} from '../groups/DonationAmount/subscriptionPeriod';
import {ReactElement, useCallback} from 'react';
import {createInterpolateElement, useEffect} from '@wordpress/element';

/**
 * @since 0.3.3 update subscription frequency label
 * @since 0.1.0
 */
export default function DonationSummary() {
    const {useWatch, useDonationSummary} = window.givewp.form.hooks;
    const {donationSummary, addDonationSummaryItems} = useDonationSummary();
    const currency = useWatch({name: 'currency'});
    const amount = useWatch({name: 'amount'});
    const period = useWatch({name: 'subscriptionPeriod'});
    const frequency = useWatch({name: 'subscriptionFrequency'});
    const formatter = useCurrencyFormatter(currency, {});

    const givingFrequency = useCallback(() => {
        if (isSubscriptionPeriod(period)) {
            const subscriptionPeriod = new SubscriptionPeriod(period);

            if (frequency > 1) {
                return createInterpolateElement(__('Every <period />', 'give'), {
                    period: <span>{`${frequency} ${subscriptionPeriod.label().plural()}`}</span>,
                });
            }

            return subscriptionPeriod.label().capitalize().adjective();
        }

        return __('One time', 'give');
    }, [period]);

    const getDonationAmount = useCallback(() => formatter.format(Number(amount)), [amount]);

    // TODO: determine if should move this up to the form level
    useEffect(
        () =>
            addDonationSummaryItems([
                {id: 'amount', label: __('Payment Amount', 'give'), value: getDonationAmount()},
                {id: 'frequency', label: __('Giving Frequency', 'give'), value: givingFrequency()},
                {id: 'total', label: __('Donation Total', 'give'), value: getDonationAmount()},
            ]),
        [amount, period, frequency]
    );

    console.log({donationSummary});
    const coreItems = ['amount', 'frequency', 'total'];
    const amountItem = donationSummary.find((item) => item.id === 'amount');
    const frequencyItem = donationSummary.find((item) => item.id === 'frequency');
    const donationTotalItem = donationSummary.find((item) => item.id === 'total');

    // TODO: determine how to handle sorting items or do it this way
    // TODO: add way to modify items
    return (
        <ul className="givewp-elements-donationSummary__list">
            {amountItem && <LineItem id={amountItem.id} label={amountItem.label} value={amountItem.value} />}
            {frequencyItem && (
                <LineItem id={frequencyItem.id} label={frequencyItem.label} value={frequencyItem.value} />
            )}

            {donationSummary
                .filter(({id}) => !coreItems.includes(id))
                .map(({id, label, value, description}, index) => {
                    return <LineItem id={id} label={label} value={value} description={description} key={index} />;
                })}

            {donationTotalItem && (
                <LineItem id={donationTotalItem.id} label={donationTotalItem.label} value={donationTotalItem.value} />
            )}
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
