import GatewayRegistrar from './GatewayRegistrar';
import FormDesignRegistrar from './FormDesignRegistrar';
import type {Form as DonationForm, FormServerExports} from '@givewp/forms/types';
import type {useFormContext, useWatch} from 'react-hook-form';

import type {
    getElementTemplate,
    getFieldErrorTemplate,
    getFieldLabelTemplate,
    getFieldTemplate,
    getGroupTemplate,
    getHeaderTemplate,
} from '@givewp/blocks/form/app/templates';
import {getDescriptionTemplate, getGoalTemplate, getTitleTemplate} from '@givewp/blocks/form/app/templates';

if (!window.givewp) {
    // @ts-ignore
    window.givewp = {};
}

window.givewp.gateways = new GatewayRegistrar();
window.givewp.form = {
    ...window.givewp.form,
    designs: new FormDesignRegistrar(),
};

interface Form extends DonationForm {
    designs: FormDesignRegistrar;
    hooks: {
        useFormContext: typeof useFormContext;
        useWatch: typeof useWatch;
    };
}

declare global {
    interface Window {
        givewp: {
            gateways: GatewayRegistrar;
            templates: {
                getFieldLabel: typeof getFieldLabelTemplate;
                getFieldError: typeof getFieldErrorTemplate;
                getField: typeof getFieldTemplate;
                getElement: typeof getElementTemplate;
                getGroup: typeof getGroupTemplate;
                getHeader: typeof getHeaderTemplate;
                getTitle: typeof getTitleTemplate;
                getDescription: typeof getDescriptionTemplate;
                getGoal: typeof getGoalTemplate;
            };
            form: Form;
        };
        giveNextGenExports: FormServerExports;
    }
}
