import {Icon} from '@wordpress/icons';
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
        lock: {remove: true},
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
    icon: () => (
        <Icon
            icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.2736 13.4026C14.1721 13.3682 13.5308 13.0689 13.9315 11.8076H13.9258C14.9704 10.6936 15.7686 8.90101 15.7686 7.13619C15.7686 4.42256 14.026 3 12.0006 3C9.97402 3 8.24093 4.4219 8.24093 7.13619C8.24093 8.90827 9.03473 10.7081 10.0857 11.8195C10.4954 12.9321 9.76281 13.3451 9.60966 13.4032C7.48861 14.1974 5 15.6451 5 17.0743V17.6101C5 19.5573 8.64613 20 12.0204 20C15.3998 20 19 19.5573 19 17.6101V17.0743C19 15.6022 16.4993 14.1657 14.2736 13.4026Z"
                        fill="#000C00"
                    />
                </svg>
            }
        />
    ),
};

export default settings;
