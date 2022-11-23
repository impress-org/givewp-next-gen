import {useFormContext, useFormState, useWatch} from 'react-hook-form';
import {
    getElementTemplate,
    getFieldErrorTemplate,
    getFieldLabelTemplate,
    getFieldTemplate,
    getGoalTemplate,
    getGroupTemplate,
    getHeaderDescriptionTemplate,
    getHeaderTemplate,
    getHeaderTitleTemplate,
} from '@givewp/blocks/form/app/templates';

/**
 *
 * This mounts data to the window object, so it can be accessed by form designs and add-ons
 *
 * @unreleased
 */
export default function mountWindowData(): void {
    window.givewp.form.hooks = {
        useFormContext,
        useWatch,
        useFormState,
    };

    window.givewp.form.templates = {
        getFieldLabel: getFieldLabelTemplate,
        getFieldError: getFieldErrorTemplate,
        getField: getFieldTemplate,
        getElement: getElementTemplate,
        getGroup: getGroupTemplate,
        getHeader: getHeaderTemplate,
        getHeaderTitle: getHeaderTitleTemplate,
        getHeaderDescription: getHeaderDescriptionTemplate,
        getGoal: getGoalTemplate,
    };
}
