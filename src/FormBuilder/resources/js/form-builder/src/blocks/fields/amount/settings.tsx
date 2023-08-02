import {FieldBlock} from '@givewp/form-builder/types';
import {__} from '@wordpress/i18n';
import {Icon} from '@wordpress/icons';
import defaultSettings from '../settings';
import Edit from './Edit';

import getDefaultBlockAttributes from '@givewp/form-builder/common/getDefaultBlockAttributes';
import {formatCurrencyAmount} from '@givewp/form-builder/common/currency';

const {
    recurringDonationChoice,
    recurringBillingInterval,
    recurringBillingPeriod,
    recurringBillingPeriodOptions,
    recurringLengthOfTime,
    recurringEnabled,
    customAmountMin,
    customAmount,
    setPrice,
    priceOption,
    levels,
    defaultLevel,
} = getDefaultBlockAttributes('givewp/donation-amount');

const levelOptions = levels.map((level, index) => ({
    label: formatCurrencyAmount(level),
    value: level,
    checked: defaultLevel === level,
}));

console.log('levelOptions: ', levelOptions);

const settings: FieldBlock['settings'] = {
    ...defaultSettings,
    title: __('Donation Amount and Levels', 'custom-block-editor'),
    description: __('The interface for donors to specify the amount they want to donate.', 'give'),
    supports: {
        multiple: false,
        html: false, // Removes support for an HTML mode.
    },
    attributes: {
        label: {
            type: 'string',
            source: 'attribute',
            default: __('Donation Amount', 'give'),
        },
        levels: {
            type: 'array',
            default: levels,
        },
        levelOptions: {
            type: 'array',
            default: levelOptions,
        },
        defaultLevel: {
            type: 'number',
            default: defaultLevel,
        },
        priceOption: {
            type: 'string',
            default: priceOption,
        },
        setPrice: {
            type: 'number',
            default: setPrice,
        },
        customAmount: {
            type: 'boolean',
            default: customAmount,
        },
        customAmountMin: {
            type: 'number',
            default: customAmountMin,
        },
        customAmountMax: {
            type: 'number',
        },
        recurringEnabled: {
            type: 'boolean',
            default: recurringEnabled,
        },
        recurringDonationChoice: {
            type: 'string',
            default: recurringDonationChoice,
        },
        recurringBillingInterval: {
            type: 'number',
            default: recurringBillingInterval,
        },
        recurringBillingPeriod: {
            type: 'string',
            default: recurringBillingPeriod,
        },
        recurringBillingPeriodOptions: {
            type: 'array',
            default: recurringBillingPeriodOptions,
        },
        recurringLengthOfTime: {
            type: 'string',
            default: recurringLengthOfTime, // ongoing
        },
    },
    edit: Edit,
    icon: () => (
        <Icon
            icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.5789 4.44118H20M4 7.52941L7.36842 4M7.36842 4V19M11.5789 8.85294H18.3158M11.5789 13.2647H16.6316M11.5789 17.6765H14.9474"
                        stroke="#000C00"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            }
        />
    ),
};

export default settings;
