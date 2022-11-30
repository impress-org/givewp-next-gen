import GatewayRegistrar from './GatewayRegistrar';
import FormDesignRegistrar from './FormDesignRegistrar';
import type {FormServerExports} from '@givewp/forms/types';
import type {useFormContext, useFormState, useWatch} from 'react-hook-form';

declare global {
    interface Window {
        giveNextGenExports: FormServerExports;
        givewp: {
            gateways: GatewayRegistrar;
            form: {
                designs: FormDesignRegistrar;
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
    window.givewp = {};
}

if (!window.givewp.form) {
    // @ts-ignore
    window.givewp.form = {};
}

window.givewp.gateways = new GatewayRegistrar();
window.givewp.form.designs = new FormDesignRegistrar();
