import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';
import useCurrencyFormatter from '../hooks/useCurrencyFormatter';

const HeaderTemplate = getHeaderTemplate();
const TitleTemplate = getTitleTemplate();
const DescriptionTemplate = getDescriptionTemplate();
const GoalTemplate = getGoalTemplate();

/**
 * TEMPORARY: This will come from the server
 */
const getProgressPercentage = (goalProgress, goalTarget) =>
    Number(Math.min((goalProgress / goalTarget) * 100, 100).toFixed(2));

/**
 * TEMPORARY: This will come from the server
 */
const getGoalLabel = (type) => {
    if (type === 'donor') {
        return __('donor', 'give');
    }

    return 'donation';
};

/**
 * TEMPORARY: This will come from the server
 */
const form = {
    showTitle: true,
    showDescription: true,
    showGoal: true,
    title: __('Support Our Cause', 'give'),
    description: __(
        'Help our organization by donating today! All donations go directly to making a difference for our cause.',
        'give'
    ),
    currency: 'USD',
    goalType: 'amount' as 'amount',
    goalValue: 1000,
    currentValue: 900,
    totalValue: 29,
    progressPercentage: getProgressPercentage(900, 1000),
    goalLabel: getGoalLabel('amount'),
};

/**
 * @unreleased
 */
const Goal = () => {
    const [currentValueFormatted, setCurrentValueFormatted] = useState<string>();
    const [goalValueFormatted, setGoalValueFormatted] = useState<string>();
    const amountFormatter = useCurrencyFormatter(form.currency, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    useEffect(() => {
        if (form.goalType === 'amount') {
            setCurrentValueFormatted(amountFormatter.format(form.currentValue));
            setGoalValueFormatted(amountFormatter.format(form.goalValue));
        }
    }, [form.goalType]);

    return (
        <GoalTemplate
            currency={form.currency}
            type={form.goalType}
            currentValue={form.currentValue}
            currentValueFormatted={currentValueFormatted}
            goalValueFormatted={goalValueFormatted}
            goalValue={form.goalValue}
            totalValue={form.totalValue}
            goalLabel={form.goalLabel}
            progressPercentage={form.progressPercentage}
        />
    );
};

/**
 * @unreleased
 */
export default function Header() {
    return (
        <HeaderTemplate
            Title={() => form.showTitle && <TitleTemplate text={form.title} />}
            Description={() => form.showDescription && <DescriptionTemplate text={form.description} />}
            Goal={() => form.showGoal && <Goal />}
        />
    );
}
