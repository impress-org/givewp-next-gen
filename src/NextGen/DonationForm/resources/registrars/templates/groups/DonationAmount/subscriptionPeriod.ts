import {__} from '@wordpress/i18n';

/**
 * @unreleased
 */
type periodLabel = {
    singular: string;
    plural: string;
    adjective: string;
};

/**
 * @unreleased
 */
const subscriptionPeriodLabelLookup = {
    day: {
        singular: __('day', 'give'),
        plural: __('days', 'give'),
        adjective: __('Daily', 'give'),
    } as periodLabel,
    week: {
        singular: __('week', 'give'),
        plural: __('weeks', 'give'),
        adjective: __('Weekly', 'give'),
    } as periodLabel,
    month: {
        singular: __('month', 'give'),
        plural: __('months', 'give'),
        adjective: __('Monthly', 'give'),
    } as periodLabel,
    quarter: {
        singular: __('quarter', 'give'),
        plural: __('quarters', 'give'),
        adjective: __('Quarterly', 'give'),
    } as periodLabel,
    year: {
        singular: __('year', 'give'),
        plural: __('years', 'give'),
        adjective: __('Yearly', 'give'),
    } as periodLabel,
};

/**
 * @unreleased
 */
type subscriptionPeriod = keyof typeof subscriptionPeriodLabelLookup;

/**
 * @unreleased
 */
class SubscriptionPeriod {
    protected period: subscriptionPeriod;

    constructor(period: subscriptionPeriod) {
        if (!isSubscriptionPeriod(period)) {
            throw new Error(`Invalid subscription period: ${period}`);
        }

        this.period = period;
    }

    label(): SubscriptionPeriodLabel {
        const periodLabel = subscriptionPeriodLabelLookup[this.period];

        return new SubscriptionPeriodLabel(periodLabel);
    }
}

/**
 * @unreleased
 */
class SubscriptionPeriodLabel {
    protected periodLabel: periodLabel;

    constructor(periodLabel: periodLabel) {
        this.periodLabel = periodLabel
    }

    singular(): string {
        return this.periodLabel.singular;
    }

    plural(): string {
        return this.periodLabel.plural;
    }

    adjective(): string {
        return this.periodLabel.adjective;
    }

    get(frequency?: number): string {
        return frequency > 1 ? `${frequency} ${this.periodLabel.plural}` : this.periodLabel.singular;
    }
}

/**
 * @unreleased
 */
const isSubscriptionPeriod = (period: subscriptionPeriod): period is subscriptionPeriod => {
    return period in subscriptionPeriodLabelLookup;
}

export type {subscriptionPeriod, periodLabel};

export {SubscriptionPeriod, isSubscriptionPeriod};
