import {useCallback, useMemo} from 'react';
import {__} from '@wordpress/i18n';
import {isSubscriptionPeriod, SubscriptionPeriod} from '../groups/DonationAmount/subscriptionPeriod';
import {createInterpolateElement} from '@wordpress/element';

/**
 * @since 0.3.3 update subscription frequency label
 * @since 0.1.0
 */
export default function DonationSummary() {
    const DonationSummaryItemsTemplate = window.givewp.form.templates.layouts.donationSummaryItems;
    const {useWatch, useCurrencyFormatter, useDonationSummary} = window.givewp.form.hooks;
    const {items, totals} = useDonationSummary();
    const currency = useWatch({name: 'currency'});
    const formatter = useCurrencyFormatter(currency);
    const amount = useWatch({name: 'amount'});
    const period = useWatch({name: 'subscriptionPeriod'});
    const frequency = useWatch({name: 'subscriptionFrequency'});
    const donationTotals = {
        ...totals,
        amount: Number(amount),
    };

    const donationTotal = useMemo(
        () =>
            Object.values(donationTotals).reduce((total: number, amount: number) => {
                return total + amount;
            }, 0),
        [JSON.stringify(donationTotals)]
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
    }, [period]);

    const summaryItems = [
        {
            id: 'amount',
            label: __('Payment Amount', 'give'),
            value: formatter.format(Number(amount)),
        },
        {
            id: 'frequency',
            label: __('Giving Frequency', 'give'),
            value: givingFrequency(),
        },
        ...items,
    ] as typeof items;

    return <DonationSummaryItemsTemplate items={summaryItems} total={formatter.format(Number(donationTotal))} />;
}
