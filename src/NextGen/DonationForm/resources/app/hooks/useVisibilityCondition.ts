import {useMemo} from 'react';
import {useWatch} from 'react-hook-form';
import {FieldCondition} from '@givewp/forms/types';

type WatchedFields = Map<string, any>;

const operators = {
    '=': (a, b) => a === b,
    '!=': (a, b) => a !== b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    contains: (a, b) => a.includes(b),
    not_contains: (a, b) => !a.includes(b),
};

/**
 * Adds visibility conditions to a field. The given conditions are watched and the hook returns true or false based on
 * whether the conditions are met.
 *
 * @unreleased
 */
export default function useVisibilityCondition(conditions: FieldCondition[]): boolean {
    const watchedFieldNames = useMemo<string[]>(() => {
        if (!conditions.length) {
            return [];
        }

        return [...conditions.reduce(watchFieldsReducer, new Set()).values()];
    }, [conditions]);

    const fieldValues = useWatch({
        name: watchedFieldNames,
    });

    const watchedFields = useMemo<WatchedFields>(() => {
        return watchedFieldNames.reduce((fields, name, index) => {
            fields.set(name, fieldValues[index]);
            return fields;
        }, new Map());
    }, [watchedFieldNames, fieldValues]);

    return useMemo<boolean>(() => {
        if (!conditions.length) {
            return true;
        }

        function conditionPassReducer(passing: boolean, condition: FieldCondition) {
            if (condition.type === 'basic') {
                const value = watchedFields.get(condition.field);

                const conditionPasses = operators[condition.comparisonOperator](value, condition.value);

                return condition.logicalOperator === 'and' ? passing && conditionPasses : passing || conditionPasses;
            }

            return condition.boolean === 'and'
                ? passing && condition.conditions.reduce(conditionPassReducer, true)
                : passing || condition.conditions.reduce(conditionPassReducer, true);
        }

        return conditions.reduce(conditionPassReducer, true);
    }, [watchedFields]);
}

/**
 * A recursive reducer that returns a set of fields that are being watched by the conditions.
 *
 * @unreleased
 */
function watchFieldsReducer(fields: Set<string>, condition: FieldCondition) {
    if (condition.type === 'basic') {
        return fields.add(condition.field);
    }

    return condition.conditions.reduce(watchFieldsReducer, fields);
}
