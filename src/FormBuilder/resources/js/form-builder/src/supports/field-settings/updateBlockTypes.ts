import normalizeFieldSettings from './normalizeFieldSettings';
import type {FieldAttributes} from './types';

/**
 * Adds attributes to the block types that support the field settings.
 *
 * @unreleased
 */
export default function updateBlockTypes(settings) {
    const fieldSettings = normalizeFieldSettings(settings.supports.givewp?.fieldSettings);

    if (fieldSettings === null) {
        return settings;
    }

    let fieldAttributes: FieldAttributes = {};

    if (fieldSettings.label) {
        fieldAttributes.label = {
            type: 'string',
            default: fieldSettings.label.default,
        };
    }

    if (fieldSettings.name) {
        fieldAttributes.fieldName = {
            type: 'string',
        };

        if (fieldSettings.name.default !== null) {
            fieldAttributes.fieldName.default = fieldSettings.name.default;
        }
    }

    if (fieldSettings.description) {
        fieldAttributes.description = {
            type: 'string',
            default: fieldSettings.description.default,
        };
    }

    if (fieldSettings.required) {
        fieldAttributes.isRequired = {
            type: 'boolean',
            default: fieldSettings.required.default,
        };
    }

    if (fieldSettings.placeholder) {
        fieldAttributes.placeholder = {
            type: 'string',
            default: fieldSettings.placeholder.default,
        };
    }

    if (fieldSettings.storeAsDonorMeta) {
        fieldAttributes.storeAsDonorMeta = {
            type: 'boolean',
            default: fieldSettings.storeAsDonorMeta.default,
        };
    }

    if (fieldSettings.displayInAdmin) {
        fieldAttributes.displayInAdmin = {
            type: 'boolean',
            default: fieldSettings.displayInAdmin.default,
        };
    }

    if (fieldSettings.displayInReceipt) {
        fieldAttributes.displayInReceipt = {
            type: 'boolean',
            default: fieldSettings.displayInReceipt.default,
        };
    }

    settings.attributes = {
        ...settings.attributes,
        ...fieldAttributes,
    };

    return settings;
}
