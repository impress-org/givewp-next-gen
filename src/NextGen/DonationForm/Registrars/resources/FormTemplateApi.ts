import {FormTemplates} from '@givewp/forms/types';

/**
 * @unreleased
 */
export default class FormTemplateApi {
    /**
     * @unreleased
     */
    public extend(templates: Partial<FormTemplates>): void {
        window.givewp.form.templates = mergeTemplates(window.givewp.form.templates, templates);
    }
}

/**
 * @unreleased
 */
export function mergeTemplates(currentTemplates: FormTemplates, incomingTemplates: Partial<FormTemplates>): FormTemplates {
    return {
        fields: {
            ...currentTemplates?.fields,
            ...incomingTemplates?.fields,
        },
        elements: {
            ...currentTemplates?.elements,
            ...incomingTemplates?.elements,
        },
        groups: {
            ...currentTemplates?.groups,
            ...incomingTemplates?.groups,
        },
        layouts: {
            ...currentTemplates?.layouts,
            ...incomingTemplates?.layouts,
        },
    };
};
