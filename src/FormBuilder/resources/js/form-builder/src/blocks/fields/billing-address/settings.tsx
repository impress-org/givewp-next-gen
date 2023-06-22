import {__} from '@wordpress/i18n';
import defaultSettings from '../settings';
import {FieldBlock} from '@givewp/form-builder/types';
import Edit from './Edit';

const settings: FieldBlock['settings'] = {
    ...defaultSettings,
    title: __('Billing Address', 'custom-block-editor'),
    description: __('Collects the donor billing address with display options.', 'give'),
    supports: {
        multiple: false,
    },
    attributes: {
        /*lock: {remove: true},*/
        country: {
            type: 'array',
            source: 'attribute',
            default: [
                {value: 'BR', label: 'Brazil'},
                {value: 'US', label: 'United States'},
            ],
        },
        addressLine1Label: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 1', 'give'),
        },
        addressLine1Placeholder: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 1', 'give'),
        },
        addressLine2Label: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 2', 'give'),
        },
        addressLine2Placeholder: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 2', 'give'),
        },
        requireAddressLine2: {
            type: 'boolean',
            default: false,
        },
    },
    edit: Edit,
    icon: 'location-alt',
};

export default settings;
