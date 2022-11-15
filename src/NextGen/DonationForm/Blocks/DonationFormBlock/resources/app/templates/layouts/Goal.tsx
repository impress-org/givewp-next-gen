export interface GoalProps {
    type: 'amount' | 'percentage' | 'donations' | 'donors'
    currentValue: number;
    goalValue: number;
}

/**
 * @unreleased
 */
export default function Goal({type, currentValue, goalValue}: GoalProps) {
    return (
        <ul>
            <li>Goal Type: {type}</li>
            <li>Progress: {currentValue} of {goalValue}</li>
        </ul>
    );
}
