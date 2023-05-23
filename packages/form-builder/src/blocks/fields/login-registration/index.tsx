import {FieldBlock} from '@givewp/form-builder/types';
import defaultSettings from '../settings';
import {__} from "@wordpress/i18n";
import {Icon} from "@wordpress/icons";
import {Button, PanelBody, PanelRow, TextControl, ToggleControl} from '@wordpress/components';
import {InspectorControls} from '@wordpress/block-editor';
import {BlockEditProps} from "@wordpress/blocks";

const loginRegistration: FieldBlock = {
    name: 'custom-block-editor/login-registration',
    settings: {
        ...defaultSettings,
        title: __('Login and Registration', 'custom-block-editor'),
        description: __('...', 'give'),
        supports: {
            multiple: false,
        },
        attributes: {
            lock: {remove: true},
            required: {
                type: 'boolean',
                default: true,
            },
        },
        edit: ({attributes, setAttributes}: BlockEditProps<any>) => {
            const {enableLogin, enableRegistration} = attributes;

            return (
                <>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                            <TextControl
                                label={__('Username or Email Address', 'givewp')}
                                onChange={() => null}
                                value={''}
                            />
                            <TextControl
                                label={__('Password', 'givewp')}
                                onChange={() => null}
                                value={''}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row-reverse', gap: '15px', justifyContent: 'space-between'}}>
                            <Button variant={'primary'}>Login</Button>
                            <Button variant={'link'}>{__('Reset Password', 'givewp')}</Button>
                        </div>
                    </div>

                    <InspectorControls>
                        <PanelBody title={__('Settings', 'give')} initialOpen={true}>
                            <PanelRow>
                                <ToggleControl
                                    label={__('Require User Login', 'give')}
                                    checked={required}
                                    onChange={() => setAttributes({required: !required})}
                                />
                            </PanelRow>
                        </PanelBody>
                    </InspectorControls>
                </>
            )
        },
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
    }
};

export default loginRegistration;
