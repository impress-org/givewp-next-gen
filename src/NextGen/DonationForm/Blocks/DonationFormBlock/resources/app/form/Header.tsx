import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';
import useCurrencyFormatter from '../hooks/useCurrencyFormatter';
import getWindowData from '../utilities/getWindowData';

const {form} = getWindowData();

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
const donationForm = {
    showTitle: true,
    showDescription: true,
    title: __('Support Our Cause', 'give'),
    description: __(
        'Help our organization by donating today! All donations go directly to making a difference for our cause.',
        'give'
    ),
};

/**
 /**
 * TODO: Determine if formatting should come from server
 */
const Goal = () => {
    const [currentValueFormatted, setCurrentValueFormatted] = useState<string>();
    const [targetValueFormatted, setTargetValueFormatted] = useState<string>();
    const amountFormatter = useCurrencyFormatter(form.currency, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    useEffect(() => {
        if (form.goal.type === 'amount') {
            setCurrentValueFormatted(amountFormatter.format(form.goal.currentValue));
            setTargetValueFormatted(amountFormatter.format(form.goal.targetValue));
        }
    }, [form.goal.type]);

    return (
        <GoalTemplate
            currency={form.currency}
            type={form.goal.type}
            currentValue={form.goal.currentValue}
            currentValueFormatted={currentValueFormatted}
            targetValueFormatted={targetValueFormatted}
            targetValue={form.goal.targetValue}
            goalLabel={form.goal.label}
            progressPercentage={form.goal.progressPercentage}
        />
    );
};

/**
 * @unreleased
 */
export default function Header() {
    return (
        <HeaderTemplate
            Title={() => donationForm.showTitle && <TitleTemplate text={donationForm.title} />}
            Description={() => donationForm.showDescription && <DescriptionTemplate text={donationForm.description} />}
            Goal={form.goal.showGoal ? () => <Goal /> : null}
        />
    );
}
