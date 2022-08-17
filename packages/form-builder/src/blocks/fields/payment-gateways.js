import {Icon} from '@wordpress/icons';
import {__} from "@wordpress/i18n";
import settings from "./settings";

const paymentGateways = {
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
            textAlign: 'center',
            border: '1px dashed var(--give-gray-100)',
            borderRadius: '5px',
            backgroundColor: 'var(--give-gray-10)',
        }}>{'Payment gateway goes here'}</div>,
        icon: () => <Icon icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.3158 4L17.0774 5.824C17.2381 5.87483 17.3785 5.97639 17.4782 6.11383C17.5779 6.25128 17.6317 6.41742 17.6316 6.588V8H19.2105C19.4199 8 19.6207 8.08429 19.7688 8.23431C19.9168 8.38434 20 8.58783 20 8.8V10.4H9.73684V8.8C9.73684 8.58783 9.82002 8.38434 9.96807 8.23431C10.1161 8.08429 10.3169 8 10.5263 8H16.0526V7.176L11.3158 5.6752L6.57895 7.176V13.0992C6.57883 13.589 6.68967 14.0723 6.90292 14.5118C7.11617 14.9513 7.42614 15.3354 7.80895 15.6344L7.95816 15.7432L11.3158 18.064L14.3016 16H10.5263C10.3169 16 10.1161 15.9157 9.96807 15.7657C9.82002 15.6157 9.73684 15.4122 9.73684 15.2V12H20V15.2C20 15.4122 19.9168 15.6157 19.7688 15.7657C19.6207 15.9157 19.4199 16 19.2105 16L16.6684 16.0008C16.3629 16.4088 15.9918 16.7688 15.5632 17.0648L11.3158 20L7.06842 17.0656C6.43094 16.6252 5.90928 16.0336 5.54879 15.3423C5.18831 14.6511 4.99992 13.881 5 13.0992V6.588C5.0001 6.41755 5.05391 6.25159 5.1536 6.11431C5.25329 5.97702 5.39365 5.87559 5.55421 5.8248L11.3158 4Z"
                    fill="#000C00" />
            </svg>
        } />,
    },
};

export default paymentGateways;
