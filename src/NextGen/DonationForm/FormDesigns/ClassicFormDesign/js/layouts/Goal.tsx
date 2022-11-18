import {__} from '@wordpress/i18n';
import GoalTemplate, {GoalProps} from '@givewp/blocks/form/app/templates/layouts/Goal';

/**
 * @unreleased
 */
const FormStats = ({
                       totalRevenue,
                       goalTargetAmount,
                       totalNumberOfDonationsOrDonors,
                       totalNumberOfDonationsOrDonorsLabel,
                   }) => {
    return (
        <aside className="givewp-form-stats-panel">
            <ul className="givewp-form-stats-panel-list">
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{totalRevenue} </span> {__('raised', 'give')}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{totalNumberOfDonationsOrDonors} </span>{' '}
                    {totalNumberOfDonationsOrDonorsLabel}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{goalTargetAmount} </span>{' '}
                    {__('goal', 'give')}
                </li>
            </ul>
        </aside>
    );
};

/**
 * @unreleased
 */
export default function Goal(props: GoalProps) {
    const {
        targetAmountFormatted,
        totalRevenueFormatted,
        totalNumberOfDonationsOrDonors,
        totalNumberOfDonationsOrDonorsLabel,
    } = props;

    return (
        <div style={{width: '100%'}}>
            <FormStats
                totalRevenue={totalRevenueFormatted}
                goalTargetAmount={targetAmountFormatted}
                totalNumberOfDonationsOrDonors={totalNumberOfDonationsOrDonors}
                totalNumberOfDonationsOrDonorsLabel={totalNumberOfDonationsOrDonorsLabel}
            />

            <GoalTemplate {...props} />
        </div>
    );
}
