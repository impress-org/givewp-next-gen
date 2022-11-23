import GatewayRegistrar from './GatewayRegistrar';
import FormDesignRegistrar from './FormDesignRegistrar';
import type {FormServerExports} from '@givewp/forms/types';
import type {useFormContext, useFormState, useWatch} from 'react-hook-form';

import type {
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

declare global {
    interface Window {
        givewp: {
            gateways: GatewayRegistrar;
            form: {
                templates: {
                    getFieldLabel: typeof getFieldLabelTemplate;
                    getFieldError: typeof getFieldErrorTemplate;
                    getField: typeof getFieldTemplate;
                    getElement: typeof getElementTemplate;
                    getGroup: typeof getGroupTemplate;
                    getHeader: typeof getHeaderTemplate;
                    getHeaderTitle: typeof getHeaderTitleTemplate;
                    getHeaderDescription: typeof getHeaderDescriptionTemplate;
                    getGoal: typeof getGoalTemplate;
                };
                designs: FormDesignRegistrar;
                hooks: {
                    useFormContext: typeof useFormContext;
                    useWatch: typeof useWatch;
                    useFormState: typeof useFormState;
                };
            };
        };
        giveNextGenExports: FormServerExports;
    }
}

if (!window.givewp) {
    // @ts-ignore
    window.givewp = {};
}

window.givewp = {
    ...window.givewp,
    gateways: new GatewayRegistrar(),
    form: {
        ...window.givewp.form,
        designs: new FormDesignRegistrar(),
    },
};
