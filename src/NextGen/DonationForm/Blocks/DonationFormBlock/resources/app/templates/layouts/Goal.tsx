import {CSSProperties} from 'react';
import {__} from '@wordpress/i18n';

export interface GoalProps {
    currency: string;
    type: string | 'amount' | 'percentage' | 'donations' | 'donors';
    currentAmount: number;
    currentAmountFormatted: string;
    targetAmount: number;
    targetAmountFormatted: string;
    goalLabel: string;
    progressPercentage: number;
    totalRevenue: number;
    totalRevenueFormatted: string;
    totalNumberOfDonationsOrDonors: number;
    totalNumberOfDonationsOrDonorsLabel: string;
}

/**
 * @unreleased
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
            <div
                role="meter"
                className="givewp-form-goal-progress-meter"
                style={{'--progress': `${progressPercentage}%`} as CSSProperties}
                aria-label={__(`${currentAmount} of ${targetAmount} ${goalLabel} goal`, 'give')}
                aria-valuemin={0}
                aria-valuemax={targetAmount}
                aria-valuenow={currentAmount}
            ></div>
        </div>
    );
}
