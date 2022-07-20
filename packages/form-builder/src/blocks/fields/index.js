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
            icon: () => <Icon icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.2736 13.4026C14.1721 13.3682 13.5308 13.0689 13.9315 11.8076H13.9258C14.9704 10.6936 15.7686 8.90101 15.7686 7.13619C15.7686 4.42256 14.026 3 12.0006 3C9.97402 3 8.24093 4.4219 8.24093 7.13619C8.24093 8.90827 9.03473 10.7081 10.0857 11.8195C10.4954 12.9321 9.76281 13.3451 9.60966 13.4032C7.48861 14.1974 5 15.6451 5 17.0743V17.6101C5 19.5573 8.64613 20 12.0204 20C15.3998 20 19 19.5573 19 17.6101V17.0743C19 15.6022 16.4993 14.1657 14.2736 13.4026Z"
                        fill="#000C00" />
                </svg>
            } />,
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
            icon: () => <Icon icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.3158 4L17.0774 5.824C17.2381 5.87483 17.3785 5.97639 17.4782 6.11383C17.5779 6.25128 17.6317 6.41742 17.6316 6.588V8H19.2105C19.4199 8 19.6207 8.08429 19.7688 8.23431C19.9168 8.38434 20 8.58783 20 8.8V10.4H9.73684V8.8C9.73684 8.58783 9.82002 8.38434 9.96807 8.23431C10.1161 8.08429 10.3169 8 10.5263 8H16.0526V7.176L11.3158 5.6752L6.57895 7.176V13.0992C6.57883 13.589 6.68967 14.0723 6.90292 14.5118C7.11617 14.9513 7.42614 15.3354 7.80895 15.6344L7.95816 15.7432L11.3158 18.064L14.3016 16H10.5263C10.3169 16 10.1161 15.9157 9.96807 15.7657C9.82002 15.6157 9.73684 15.4122 9.73684 15.2V12H20V15.2C20 15.4122 19.9168 15.6157 19.7688 15.7657C19.6207 15.9157 19.4199 16 19.2105 16L16.6684 16.0008C16.3629 16.4088 15.9918 16.7688 15.5632 17.0648L11.3158 20L7.06842 17.0656C6.43094 16.6252 5.90928 16.0336 5.54879 15.3423C5.18831 14.6511 4.99992 13.881 5 13.0992V6.588C5.0001 6.41755 5.05391 6.25159 5.1536 6.11431C5.25329 5.97702 5.39365 5.87559 5.55421 5.8248L11.3158 4Z"
                        fill="#000C00" />
                </svg>
            } />,
        },
    },
];

const fieldBlockNames = fieldBlocks.map(field => field.name);

export default fieldBlocks;
export {
    fieldBlockNames,
};
