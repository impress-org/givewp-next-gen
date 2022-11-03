import GatewayRegistrar from './GatewayRegistrar';
import TemplateRegistrar from './TemplateRegistrar';
import type {FormServerExports} from '@givewp/forms/types';
import type {UseFormReturn} from 'react-hook-form';

import type {
    // import the functions as types so that they are not included in the bundle
    getFieldLabelTemplate,
    getFieldErrorTemplate,
    getFieldTemplate,
    getElementTemplate,
    getGroupTemplate,
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
            };
            form: {
                useFormContext(): UseFormReturn;
                useWatch(options: {
                    name: string | string[];
                    defaultValue?: any;
                    control?: object;
                    disabled?: boolean;
                    exact?: boolean;
                }): any;
            };
        };
        giveNextGenExports: FormServerExports;
    }
}
