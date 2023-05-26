import {__} from '@wordpress/i18n';
import {useCallback} from 'react';
import {createInterpolateElement} from '@wordpress/element';
import {
    isSubscriptionPeriod,
    SubscriptionPeriod,
} from '../../registrars/templates/groups/DonationAmount/subscriptionPeriod';

export default function useDonationFormSummary() {
    const {useWatch, useCurrencyFormatter} = window.givewp.form.hooks;
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

    return {
        items: [
            {id: 'amount', label: __('Payment Amount', 'give'), value: formatter.format(Number(amount))},
            {id: 'frequency', label: __('Giving Frequency', 'give'), value: givingFrequency()},
        ],
        totals: {
            amount: Number(amount),
        },
    };
}