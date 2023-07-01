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
        country: {
            type: 'array',
            source: 'attribute',
            default: [{value: 'sample', label: __('A full country list will be displayed here...', 'give')}],
        },
        countryLabel: {
            type: 'string',
            source: 'attribute',
            default: __('Country', 'give'),
        },
        address1Label: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 1', 'give'),
        },
        address1Placeholder: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 1', 'give'),
        },
        address2Label: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 2', 'give'),
        },
        address2Placeholder: {
            type: 'string',
            source: 'attribute',
            default: __('Address Line 2', 'give'),
        },
        requireAddress2: {
            type: 'boolean',
            default: false,
        },
        cityLabel: {
            type: 'string',
            source: 'attribute',
            default: __('City', 'give'),
        },
        cityPlaceholder: {
            type: 'string',
            source: 'attribute',
            default: __('City', 'give'),
        },
        stateLabel: {
            type: 'string',
            source: 'attribute',
            default: __('State/Province/Country', 'give'),
        },
        statePlaceholder: {
            type: 'string',
            source: 'attribute',
            default: __('This changes by country selection...', 'give'),
        },
        zipLabel: {
            type: 'string',
            source: 'attribute',
            default: __('Zip/Postal Code', 'give'),
        },
        zipPlaceholder: {
            type: 'string',
            source: 'attribute',
            default: __('Zip/Postal Code', 'give'),
        },
    },
    edit: Edit,
    icon: 'location-alt',
};

export default settings;
