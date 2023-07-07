import {FieldSettings, FieldSettingsSupport} from "./types";

/**
 * Takes in the "supports" settings for a field and normalizes them into a standard object. It is recommended to use
 * this function rather than the settings directly.
 *
 * @unreleased
 */
export default function normalizeFieldSettings(settings: FieldSettingsSupport | false): FieldSettings | null {
    if (settings === undefined || settings === false) {
        return null;
    }

    const getSupportSetting = (setting: keyof FieldSettings, enabledByDefault: boolean, defaultValue: any) => {
        if (settings[setting] === false) {
            return false;
        }

        if (settings === true || settings[setting] === true || settings[setting] === undefined) {
            return enabledByDefault ? {default: defaultValue} : false;
        }

        // @ts-ignore - it logically must be the default object
        return {default: settings[setting].default};
    };

    return {
        label: getSupportSetting('label', true, ''),
        name: getSupportSetting('name', true, ''),
        placeholder: getSupportSetting('placeholder', false, ''),
        required: getSupportSetting('required', true, false),
        storeAsDonorMeta: getSupportSetting('storeAsDonorMeta', true, true),
        displayInAdmin: getSupportSetting('displayInAdmin', true, false),
        displayInReceipt: getSupportSetting('displayInReceipt', true, true),
    };
}
