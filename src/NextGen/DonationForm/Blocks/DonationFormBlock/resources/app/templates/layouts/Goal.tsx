import {CSSProperties} from 'react';
import {__} from '@wordpress/i18n';

export interface GoalProps {
    currency: string;
    type: string | 'amount' | 'percentage' | 'donations' | 'donors';
    currentValue: number;
    currentValueFormatted: string;
    targetValue: number;
    targetValueFormatted: string;
    goalLabel: string;
    progressPercentage: number;
}

/**
 * @unreleased
 */
export default function Goal({
    currentValue,
    currentValueFormatted,
    targetValue,
    targetValueFormatted,
    goalLabel,
    progressPercentage,
}: GoalProps) {
    return (
        <div className="givewp-form-goal-progress">
            <div className="givewp-form-goal-progress-description">
                <span>{__(`${currentValueFormatted} of ${targetValueFormatted} ${goalLabel} goal`, 'give')}</span>
            </div>
            <div
                role="meter"
                className="givewp-form-goal-progress-meter"
                style={{'--progress': `${progressPercentage}%`} as CSSProperties}
                aria-label={__(`${currentValue} of ${targetValue} ${goalLabel} goal`, 'give')}
                aria-valuemin={0}
                aria-valuemax={targetValue}
                aria-valuenow={currentValue}
            ></div>
        </div>
    );
}
