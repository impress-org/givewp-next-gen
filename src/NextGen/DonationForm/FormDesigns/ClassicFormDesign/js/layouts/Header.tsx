import {__} from '@wordpress/i18n';

/**
 * TEMPORARY: This will come from the server
 */
const form = {
    currency: 'USD',
    goalType: 'amount',
    goalValue: 1000,
    currentValue: 900,
    totalValue: 29,
    progressPercentage: 90,
    goalLabel: 'donations',
};

/**
 * @unreleased
 */
const SecureBadge = () => {
    return (
        <aside className="givewp-form-secure-badge">
            <svg className="givewp-form-secure-icon">
                <path
                    d="M9.375 5.75h-.563V4.062C8.813 2.117 7.196.5 5.25.5a3.576 3.576 0 0 0-3.563 3.563V5.75h-.562C.492 5.75 0 6.266 0 6.875v4.5A1.11 1.11 0 0 0 1.125 12.5h8.25c.61 0 1.125-.492 1.125-1.125v-4.5A1.14 1.14 0 0 0 9.375 5.75Zm-2.438 0H3.563V4.062c0-.914.75-1.687 1.688-1.687.914 0 1.688.773 1.688 1.688V5.75Z"
                    fill="currentColor"
                />
            </svg>
            {__('100% Secure Donation', 'give')}
        </aside>
    );
};

const FormStats = ({currentValue, goalValue, totalValue, goalLabel}) => {
    return (
        <aside className="givewp-form-stats-panel">
            <ul className="givewp-form-stats-panel-list">
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{currentValue} </span> {__('raised', 'give')}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{totalValue} </span> {goalLabel}
                </li>
                <li className="givewp-form-stats-panel-stat">
                    <span className="givewp-form-stats-panel-stat-number">{goalValue} </span> {__('goal', 'give')}
                </li>
            </ul>
        </aside>
    );
};

/**
 * @unreleased
 */
export default function Header({Title, Description, Goal}) {
    return (
        <>
            <Title />
            <Description />
            <SecureBadge />
            {Goal && (
                <div style={{width: '100%'}}>
                    <FormStats
                        currentValue={form.currentValue}
                        goalValue={form.goalValue}
                        totalValue={form.totalValue}
                        goalLabel={form.goalLabel}
                    />
                    <Goal />
                </div>
            )}
        </>
    );
}


