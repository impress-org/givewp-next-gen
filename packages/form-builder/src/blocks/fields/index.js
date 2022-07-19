import {Icon} from '@wordpress/icons';
import {__} from "@wordpress/i18n";
import settings from "./settings";
import DonorName from "./donorName";

/**
 * @note Blocks in the appender are listed in the order that the blocks are registered.
 */

const fieldBlocks = [
    {
        name: 'custom-block-editor/field',
        category: 'custom',
        settings: {
            ...settings,
            title: __('Text', 'custom-block-editor'),
            icon: () => <Icon icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.8449 6.89062L7.05176 16.5H9.1684L9.89932 14.6484H14.1006L14.8316 16.5H16.9482L13.155 6.89062H10.8449ZM10.6765 12.6797L12 9.32658L13.3235 12.6797H10.6765Z"
                        fill="#000C00" />
                    <path
                        d="M18 2.625H6V0.75H0.75V6H2.625V18H0.75V23.25H6V21.375H18V23.25H23.25V18H21.375V6H23.25V0.75H18V2.625ZM2.25 4.5V2.25H4.5V4.5H2.25ZM4.5 21.75H2.25V19.5H4.5V21.75ZM18 19.875H6V18H4.125V6H6V4.125H18V6H19.875V18H18V19.875ZM21.75 19.5V21.75H19.5V19.5H21.75ZM19.5 2.25H21.75V4.5H19.5V2.25Z"
                        fill="#000C00" />
                </svg>
            } />,
        },
    },
    {
        name: 'custom-block-editor/company-field',
        category: 'input',
        settings: {
            ...settings,
            title: __('Company', 'custom-block-editor'),
            supports: {
                multiple: false,
            },
            attributes: {
                label: {
                    default: __('Company Name'),
                },
            },
            icon: () => <Icon icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 2H6C4.897 2 4 2.897 4 4V21C4 21.2652 4.10536 21.5196 4.29289 21.7071C4.48043 21.8946 4.73478 22 5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21V4C20 2.897 19.103 2 18 2ZM18 20H6V4H18V20Z"
                        fill="#000C00" />
                    <path
                        d="M8 6H11V8H8V6ZM13 6H16V8H13V6ZM8 10H11V12H8V10ZM13 10.031H16V12H13V10.031ZM8 14H11V16H8V14ZM13 14H16V16H13V14Z"
                        fill="#000C00" />
                </svg>
            } />,
        },
    },
    {
        name: 'custom-block-editor/donor-name',
        category: 'input',
        settings: {
            ...settings,
            title: __('Donor Name', 'custom-block-editor'),
            supports: {
                multiple: false,
            },
            attributes: {
                lock: {remove: true},
                showHonorific: {
                    type: 'boolean',
                    default: true,
                },
                honoriphics: {
                    type: 'array',
                    default: ['Mr', 'Ms', 'Mrs'],
                },
                requireLastName: {
                    type: 'boolean',
                    default: false,
                },
            },
            edit: DonorName,
        },
    },
    {
        name: 'custom-block-editor/email-field',
        category: 'input',
        settings: {
            ...settings,
            title: __('Email', 'custom-block-editor'),
            supports: {
                multiple: false,
            },
            attributes: {
                lock: {remove: true},
                label: {
                    default: __('Email Address'),
                },
            },
            icon: () => <Icon icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                        fill="#000C00" />
                </svg>
            } />,
        },
    },
    {
        name: 'custom-block-editor/payment-gateways',
        category: 'input',
        settings: {
            ...settings,
            title: __('Payment Gateways', 'custom-block-editor'),
            supports: {
                multiple: false,
            },
            attributes: {
                lock: {remove: true},
            },
            edit: () => <div style={{
                padding: '20px',
                margin: '20px 0',
                textAlign: 'center',
                backgroundColor: '#fafafa',
            }}>{'Payment Gateways Go Here'}</div>,
        },
    },
];

const fieldBlockNames = fieldBlocks.map(field => field.name);

export default fieldBlocks;
export {
    fieldBlockNames,
};
