import GatewayRegistrar from './GatewayRegistrar';
import TemplateRegistrar from './TemplateRegistrar';
import type {FormServerExports} from '@givewp/forms/types';
import type {useFormContext, useWatch} from 'react-hook-form';

import type {
    getElementTemplate,
    getFieldErrorTemplate,
    getFieldLabelTemplate,
    getFieldTemplate,
    getGroupTemplate,
    getHeaderTemplate,
} from '../../Blocks/DonationFormBlock/resources/app/templates';
import {
    getDescriptionTemplate,
    getGoalTemplate,
    getTitleTemplate,
} from '../../Blocks/DonationFormBlock/resources/app/templates';

if (!window.givewp) {
    // @ts-ignore
    window.givewp = {};
}

window.givewp.gateways = new GatewayRegistrar();
window.givewp.template = new TemplateRegistrar();

declare global {
    interface Window {
        givewp: {
            gateways: GatewayRegistrar;
            template: TemplateRegistrar;
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
            form: {
                useFormContext: typeof useFormContext;
                useWatch: typeof useWatch;
            };
        };
        giveNextGenExports: FormServerExports;
    }
}
