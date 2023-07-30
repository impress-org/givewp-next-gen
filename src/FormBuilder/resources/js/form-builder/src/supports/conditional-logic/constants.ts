import {__} from '@wordpress/i18n';
import {SelectControl} from '@wordpress/components';

import {TranslatableLabels} from '@givewp/form-builder/supports/conditional-logic/types';

export const labels: TranslatableLabels = {
    actions: {
        show: __('Show', 'give'),
        hide: __('Hide', 'give'),
    },
    booleans: {
        and: __('All', 'give'),
        or: __('Any', 'give'),
    },
    operators: {
        '=': __('Equals', 'give'),
        '!=': __('Does not equal', 'give'),
        '>': __('Greater than', 'give'),
        '<': __('Less than', 'give'),
        '>=': __('Greater than or equals', 'give'),
        '<=': __('Less than or equals', 'give'),
    },
};

// @ts-ignore
export const conditionOptions: SelectControl.Option[] = [];
const actionValues = Object.keys(labels.actions);
const conditionValues = Object.keys(labels.booleans);

for (const actionValue of actionValues) {
    for (const conditionValue of conditionValues) {
        const actionLabel = labels.actions[actionValue];
        const conditionLabel = labels.booleans[conditionValue];
        const option = {
            label: `${actionLabel}, ${conditionLabel}`,
            value: `${actionValue}-${conditionValue}`,
        };
        conditionOptions.push(option);
    }
}
