import {FormDesign, FormPageSettings} from '@givewp/form-builder/types';

declare global {
    interface Window {
        storageData?: {
            formDesigns: FormDesign[];
            formPage: FormPageSettings;
            currency: string;
        },
        formBuilderData?: {
            gateways: Array<any>;
        },
    }
}

export default function getWindowData() {
    return window.storageData;
}

export function getStorageData() {
    return window.storageData;
}

export function getFormBuilderData() {
    return window.formBuilderData;
}
