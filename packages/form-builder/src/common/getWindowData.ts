import {
    FormDesign,
    FormPageSettings,
    Gateway,
    TemplateTag,
    EmailNotification,
} from '@givewp/form-builder/types';

declare global {
    interface Window {

        wp?: any;
        storageData?: {
            formId: number;
            formDesigns: FormDesign[];
            formPage: FormPageSettings;
            currency: string;
        },
        formBuilderData?: {
            gateways: Gateway[];
            recurringAddonData?: {
                isInstalled: boolean;
            },
            gatewaySettingsUrl: string;
            emailTemplateTags: TemplateTag[];
            emailNotifications: EmailNotification[];
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
