import {__} from '@wordpress/i18n';
import type {GoalProps} from '@givewp/forms/propTypes';

/**
 * @since 0.1.0
 */
export default function Goal({
    currentAmount,
    currentAmountFormatted,
    targetAmount,
    targetAmountFormatted,
    goalLabel,
    progressPercentage,
}: GoalProps) {
    return (
        <div className="givewp-form-goal-progress">
            <div className="givewp-form-goal-progress-description">
                <span>{__(`${currentAmountFormatted} of ${targetAmountFormatted} ${goalLabel} goal`, 'give')}</span>
            </div>
            <progress
                className="givewp-form-goal-progress-meter"
                value={progressPercentage}
                max={100}
                aria-label={__(`${currentAmount} of ${targetAmount} ${goalLabel} goal`, 'give')}
            ></progress>
        </div>
    );
}
