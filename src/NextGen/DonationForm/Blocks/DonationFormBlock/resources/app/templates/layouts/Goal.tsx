import {CSSProperties, useEffect, useMemo, useState} from 'react';
import useCurrencyFormatter from '../../hooks/useCurrencyFormatter';
import {__} from '@wordpress/i18n';

export interface GoalProps {
    currency: string;
    type: 'amount' | 'percentage' | 'donations' | 'donors';
    currentValue: number;
    goalValue: number;
    totalValue: number;
}

const getProgressPercentage = (goalProgress, goalTarget) =>
    Number(Math.min((goalProgress / goalTarget) * 100, 100).toFixed(2));

/**
 * @unreleased
 */
export default function Goal({type = 'amount', currency = 'USD', currentValue, goalValue, totalValue}: GoalProps) {
    const [currentValueFormatted, setCurrentValueFormatted] = useState<string>();
    const [goalValueFormatted, setGoalValueFormatted] = useState<string>();

    const progressPercentage = useMemo(() => getProgressPercentage(currentValue, goalValue), []);
    const amountFormatter = useCurrencyFormatter(currency, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    useEffect(() => {
        if (type === 'amount') {
            setCurrentValueFormatted(amountFormatter.format(currentValue));
            setGoalValueFormatted(amountFormatter.format(goalValue));
        }
    }, [type]);

    return (
        <aside className="give-form-stats-panel">
            <ul className="give-form-stats-panel-list">
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">{currentValueFormatted} </span>{' '}
                    {__('raised', 'give')}
                </li>
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">{totalValue} </span>{' '}
                    {type === 'donors' ? __('donors', 'give') : __('donations', 'give')}
                </li>
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">{goalValueFormatted} </span>{' '}
                    {__('goal', 'give')}
                </li>
                <li className="give-form-goal-progress">
                    <div
                        role="meter"
                        className="give-form-goal-progress-meter"
                        style={{'--progress': `${progressPercentage}%`} as CSSProperties}
                        aria-label={__(`${currentValue} of ${goalValue} goal`, 'give')}
                        aria-valuemin={0}
                        aria-valuemax={goalValue}
                        aria-valuenow={currentValue}
                    ></div>
                </li>
            </ul>
        </aside>
    );
}
