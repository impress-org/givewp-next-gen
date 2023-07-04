import {__} from "@wordpress/i18n";

import normalizeFieldSettings from "./normalizeFieldSettings";
import type {FieldAttributes} from "./types";

export default function updateBlockTypes(settings) {
    const fieldSettings = normalizeFieldSettings(settings.supports.giveWPFieldSettings);

    if (fieldSettings === null) {
        return settings;
    }

    let fieldAttributes: FieldAttributes = {};

    if (fieldSettings.label) {
        fieldAttributes.label = {
            type: 'string',
            default: __('Text Field', 'give'),
        };
    }

    if (fieldSettings.name) {
        fieldAttributes.fieldName = {
            type: 'string',
            default: '',
        };
    }

    if (fieldSettings.required) {
        fieldAttributes.isRequired = {
            type: 'boolean',
            default: false,
        };
    }

    if (fieldSettings.placeholder) {
        fieldAttributes.placeholder = {
            type: 'string',
            default: '',
        };
    }

    if (fieldSettings.storeAsDonorMeta) {
        fieldAttributes.storeAsDonorMeta = {
            type: 'boolean',
            default: false,
        };
    }

    if (fieldSettings.displayInAdmin) {
        fieldAttributes.displayInAdmin = {
            type: 'boolean',
            default: true,
        };
    }

    if (fieldSettings.displayInReceipt) {
        fieldAttributes.displayInReceipt = {
            type: 'boolean',
            default: true,
        };
    }

    settings.attributes = {
        ...settings.attributes,
        ...fieldAttributes,
    };

    return settings;
}
