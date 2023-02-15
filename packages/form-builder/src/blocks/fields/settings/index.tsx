import {__} from '@wordpress/i18n';
import DefaultFieldSettings from './DefaultFieldSettings';
import {BlockAttributes, BlockConfiguration} from '@wordpress/blocks';

const defaultSettings: BlockConfiguration = {
    title: __('Field', 'custom-block-editor'),
    category: 'input',
    supports: {
        html: false, // Removes support for an HTML mode.
        multiple: true,
        customClassName: false,
    },
    attributes: {
        fieldName: {
            type: 'string',
            source: 'attribute',
        },
        label: {
            type: 'string',
            source: 'attribute',
            default: __('Text Field', 'give'),
        },
        placeholder: {
            type: 'string',
            source: 'attribute',
            default: '',
        },
        isRequired: {
            type: 'boolean',
            source: 'attribute',
            default: false,
        },
        options: {
            type: 'array',
        },
    },

    edit: DefaultFieldSettings,

    save: function () {
        return null; // Save as attributes - not rendered HTML.
    },
};

export default defaultSettings;

const {fieldName, label, placeholder, isRequired, options} = defaultSettings.attributes as BlockAttributes;

export {fieldName, label, placeholder, isRequired, options};
