import {__} from '@wordpress/i18n';
import {GoalProps} from '@givewp/blocks/form/app/templates/layouts/Goal';
import {useMemo} from 'react';

/**
 * @unreleased
 */
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
export default function Goal(props: GoalProps) {
    const {targetValueFormatted, totalRevenueFormatted, totalNumber, totalNumberLabel} = props;

    const DefaultGoalTemplate = useMemo(() => window.givewp.templates.getDefaultGoal(), []);

    return (
        <div style={{width: '100%'}}>
            <FormStats
                totalRevenue={totalRevenueFormatted}
                goalTargetValue={targetValueFormatted}
                totalNumber={totalNumber}
                totalLabel={totalNumberLabel}
            />

            <DefaultGoalTemplate {...props} />
        </div>
    );
}
