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

    const getSupportSetting = (setting: keyof FieldSettings, defaultValue: boolean) => {
        return settings === true || settings[setting] === undefined ? defaultValue : settings[setting];
    };

    return {
        label: getSupportSetting('label', true),
        name: getSupportSetting('name', true),
        placeholder: getSupportSetting('placeholder', false),
        required: getSupportSetting('required', true),
        storeAsDonorMeta: getSupportSetting('storeAsDonorMeta', true),
        displayInAdmin: getSupportSetting('displayInAdmin', true),
        displayInReceipt: getSupportSetting('displayInReceipt', true),
    };
}
