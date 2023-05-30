import {useCallback, useMemo} from 'react';
import {__} from '@wordpress/i18n';
import {isSubscriptionPeriod, SubscriptionPeriod} from '../groups/DonationAmount/subscriptionPeriod';
import {createInterpolateElement, useEffect} from '@wordpress/element';

/**
 * @since 0.3.3 update subscription frequency label
 * @since 0.1.0
 */
export default function DonationSummary() {
    const DonationSummaryItemsTemplate = window.givewp.form.templates.layouts.donationSummaryItems;
    const {useWatch, useCurrencyFormatter, useDonationSummary} = window.givewp.form.hooks;
    const {items, totals, addItem, addToTotal} = useDonationSummary();
    const currency = useWatch({name: 'currency'});
    const formatter = useCurrencyFormatter(currency);

    const amount = useWatch({name: 'amount'});
    const period = useWatch({name: 'subscriptionPeriod'});
    const frequency = useWatch({name: 'subscriptionFrequency'});

    useEffect(() => {
        addItem({
            id: 'amount',
            label: __('Payment Amount', 'give'),
            value: formatter.format(Number(amount)),
        });

        addToTotal('amount', Number(amount));
    }, [amount]);

    useEffect(
        () =>
            addItem({
                id: 'frequency',
                label: __('Giving Frequency', 'give'),
                value: givingFrequency(),
            }),
        [period, frequency]
    );

    const donationTotal = useMemo(
        () =>
            Object.values(totals).reduce((total: number, amount: number) => {
                return total + amount;
            }, 0),
        [JSON.stringify(totals)]
    );

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
    }, [period, frequency]);

    const getDonationSummaryItems = useCallback(
        () => Object.values(items).map((item) => item),
        [JSON.stringify(items)]
    );

    const getDonationTotalFormatted = useCallback(() => formatter.format(Number(donationTotal)), [donationTotal]);

    return useMemo(
        () => <DonationSummaryItemsTemplate items={getDonationSummaryItems()} total={getDonationTotalFormatted()} />,
        [JSON.stringify(items), JSON.stringify(totals)]
    );
}
