import {CSSProperties} from 'react';

export interface GoalProps {
    type: 'amount' | 'percentage' | 'donations' | 'donors';
    currentValue: number;
    goalValue: number;
}

/**
 * @unreleased
 */
export default function Goal({type, currentValue, goalValue}: GoalProps) {
    return (
        <aside className="give-form-stats-panel">
            <ul className="give-form-stats-panel-list">
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">{currentValue} </span> raised
                </li>
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">129 </span> donations
                </li>
                <li className="give-form-stats-panel-stat">
                    <span className="give-form-stats-panel-stat-number">{goalValue} </span> goal
                </li>
                <li className="give-form-goal-progress">
                    <div
                        role="meter"
                        className="give-form-goal-progress-meter"
                        style={{'--progress': '292.75%'} as CSSProperties}
                        aria-label="$29,275 of $10,000 goal"
                        aria-valuemin={0}
                        aria-valuemax={10000}
                        aria-valuenow={29275.37}
                        aria-valuetext="292.75%"
                    ></div>
                </li>
            </ul>
        </aside>
    );
}
