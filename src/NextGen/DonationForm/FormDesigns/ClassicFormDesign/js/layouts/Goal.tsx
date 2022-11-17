import {__} from '@wordpress/i18n';
import {GoalProps} from '@givewp/blocks/form/app/templates/layouts/Goal';
import {CSSProperties, useMemo} from 'react';

const FormStats = ({totalRevenue, goalTargetValue, totalNumber, totalLabel}) => {
    return (
        <aside className="givewp-form-stats-panel">
            <ul className="givewp-form-stats-panel-list">
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{totalRevenue} </span> {__('raised', 'give')}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{totalNumber} </span> {totalLabel}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{goalTargetValue} </span> {__('goal', 'give')}
                </li>
            </ul>
        </aside>
    );
};

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
    totalRevenueFormatted,
    totalNumber,
    totalNumberLabel
}: GoalProps) {
    const DefaultGoal = () => useMemo(() => {
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
        )
    },[]);

    return (
        <div style={{width: '100%'}}>
            <FormStats
                totalRevenue={totalRevenueFormatted}
                goalTargetValue={targetValueFormatted}
                totalNumber={totalNumber}
                totalLabel={totalNumberLabel}
            />
            <DefaultGoal />
        </div>
    );
}
