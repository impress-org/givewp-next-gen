import {__} from '@wordpress/i18n';
import settings from '../settings';
import {FieldBlock} from '@givewp/form-builder/types';
import Edit from './Edit';
import Icon from './Icon';

const paymentGateways: FieldBlock = {
    name: 'custom-block-editor/payment-gateways',
    settings: {
        ...settings,
        title: __('Payment Gateways', 'custom-block-editor'),
        supports: {
            multiple: false,
        },
        attributes: {
            lock: {remove: true},
        },
        edit: Edit,
        icon: Icon,
    },
};

export default paymentGateways;
