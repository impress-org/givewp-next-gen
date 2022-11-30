import GatewayRegistrar from './GatewayRegistrar';
import type {FormServerExports, FormTemplates} from '@givewp/forms/types';
import type {useFormContext, useFormState, useWatch} from 'react-hook-form';
import FormTemplateApi from './FormTemplateApi';

declare global {
    interface Window {
        giveNextGenExports: FormServerExports;
        givewp: {
            gateways: GatewayRegistrar;
            form: {
                api: {
                    templates: FormTemplateApi;
                };
                templates: FormTemplates;
                hooks: {
                    useFormContext: typeof useFormContext;
                    useWatch: typeof useWatch;
                    useFormState: typeof useFormState;
                };
            };
        };
    }
}

if (!window.givewp) {
    // @ts-ignore
    window.givewp = {
        // @ts-ignore
        form: {
            // @ts-ignore
            api: {},
        },
    };
}

window.givewp.gateways = new GatewayRegistrar();
window.givewp.form.api.templates = new FormTemplateApi();
