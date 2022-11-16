import {CSSProperties} from 'react';
import {__} from '@wordpress/i18n';

export interface GoalProps {
    currency: string;
    type: 'amount' | 'percentage' | 'donations' | 'donors';
    currentValue: number;
    currentValueFormatted: string;
    goalValue: number;
    goalValueFormatted: string;
    totalValue: number;
    goalLabel: string;
    progressPercentage: number;
}

/**
 * @unreleased
 */
export default function Goal({
                                 currentValue,
                                 currentValueFormatted,
                                 goalValue,
                                 goalValueFormatted,
                                 totalValue,
                                 goalLabel,
                                 progressPercentage,
                             }: GoalProps) {
    return (
        <div className="givewp-form-goal-progress">
            <div className="givewp-form-goal-progress-description">
                <span>{__(`${currentValueFormatted} of ${goalValueFormatted} goal`, 'give')}</span>
            </div>
            <div
                role="meter"
                className="givewp-form-goal-progress-meter"
                style={{'--progress': `${progressPercentage}%`} as CSSProperties}
                aria-label={__(`${currentValue} of ${goalValue} goal`, 'give')}
                aria-valuemin={0}
                aria-valuemax={goalValue}
                aria-valuenow={currentValue}
            ></div>
        </div>
    );
}
