'use strict';

import type {
    FormTemplateElements,
    FormTemplateFields,
    FormTemplateGroups,
    FormTemplateLayouts,
    FormTemplates,
} from '@givewp/forms/types';

/**
 * @unreleased
 */
interface SubTemplateExtension {
    extend(templates: Partial<FormTemplates[keyof FormTemplates]>): void;
}

/**
 * @unreleased
 */
interface TemplateApi {
    layouts: FormTemplateLayoutsApi;
    fields: FormTemplateFieldsApi;
    elements: FormTemplateElementsApi;
    groups: FormTemplateGroupsApi;
}

/**
 * @unreleased
 */
function extendTemplate<T extends keyof FormTemplates>(
    templateType: T,
    templates: Partial<FormTemplates[keyof FormTemplates]>
): void {
    Object.keys(templates).forEach((template) => {
        if (!window.givewp.form.templates[templateType].hasOwnProperty(template)) {
            throw Error(`${template} does not exist on ${templateType}`);
        }

        window.givewp.form.templates[templateType][template] = templates[template];
    });
}

/**
 * @unreleased
 */
class FormTemplateLayoutsApi implements SubTemplateExtension {
    public extend(layouts: Partial<FormTemplateLayouts>): void {
        extendTemplate('layouts', layouts);
    }
}

/**
 * @unreleased
 */
class FormTemplateFieldsApi implements SubTemplateExtension {
    public extend(fields: Partial<FormTemplateFields>): void {
        extendTemplate('fields', fields);
    }
}

/**
 * @unreleased
 */
class FormTemplateElementsApi implements SubTemplateExtension {
    public extend(elements: Partial<FormTemplateElements>): void {
        extendTemplate('elements', elements);
    }
}

/**
 * @unreleased
 */
class FormTemplateGroupsApi implements SubTemplateExtension {
    public extend(groups: Partial<FormTemplateGroups>): void {
        extendTemplate('groups', groups);
    }
}

/**
 * @unreleased
 */
export default class FormTemplateApi implements TemplateApi {
    private hasTemplates: boolean = false;
    public layouts = new FormTemplateLayoutsApi();
    public fields = new FormTemplateFieldsApi();
    public elements = new FormTemplateElementsApi();
    public groups = new FormTemplateGroupsApi();

    /**
     * @unreleased
     */
    public init(templates: FormTemplates): void {
        if (!this.hasTemplates) {
            window.givewp.form.templates = Object.freeze(templates);

            this.hasTemplates = true;
        }
    }
}
