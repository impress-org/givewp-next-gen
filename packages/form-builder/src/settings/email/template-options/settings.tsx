import {useEffect, useRef} from "react";
import {setFormSettings, useFormState, useFormStateDispatch} from "@givewp/form-builder/stores/form-state";
import {Button, RadioControl, SelectControl, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import Editor from "./components/editor";
import {getFormBuilderData} from "@givewp/form-builder/common/getWindowData";

const EmailTemplateSettings = ({notification}) => {

    const dispatch = useFormStateDispatch();
    const {settings: {emailTemplateOptions}} = useFormState();

    const {emailNotifications} = getFormBuilderData();
    const config = emailNotifications.find((config) => config.id === notification);

    const option = emailTemplateOptions[notification] ?? {
        'status': 'global',
        'email_subject': '',
        'email_header': '',
        'email_message': '',
        'email_content_type': '',
    };

    const updateEmailTemplateOption = (property, value) => {
        dispatch(setFormSettings({emailTemplateOptions: {
                ...emailTemplateOptions,
                [notification]: {
                    ...option,
                    [property]: value
                }
            }}))
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--givewp-spacing-6)',
            marginBottom: '20px', // Prevent clipping
        }}>
            <RadioControl
                className='radio-control--email-options'
                label={__('Email options', 'givewp')}
                hideLabelFromVision={true}
                help={__('Global options are set in GiveWP settings. You may override them for this form here', 'givewp')}
                selected={option.status || 'global'}
                options={config.statusOptions}
                onChange={(value) => updateEmailTemplateOption('status', value)}
            />

            {'enabled' === option.status && (
                <>
                    <TextControl
                        label={__('Email Subject', 'givewp')}
                        help={__('Enter the email subject line', 'givewp')}
                        onChange={(value) => updateEmailTemplateOption('email_subject', value)}
                        value={option.email_subject || config.defaultValues.email_subject}
                    />

                    <TextControl
                        label={__('Email Header', 'givewp')}
                        help={__('Enter the email header that appears at the top of the email', 'givewp')}
                        onChange={(value) => updateEmailTemplateOption('email_header', value)}
                        // @ts-ignore
                        value={option.email_header || config.defaultValues.email_header}
                    />

                    <Editor
                        value={option?.email_message || config.defaultValues.email_message}
                        onChange={(value) => updateEmailTemplateOption('email_message', value)}
                    />

                    <SelectControl
                        onChange={(value) => updateEmailTemplateOption('email_content_type', value)}
                        label={__('Email content type', 'givewp')}
                        help={__('Choose email type', 'givewp')}
                        value={option.email_content_type || config.defaultValues.email_content_type}
                        options={[
                            {label: __('HTML', 'givewp'), value: 'text/html'},
                            {label: __('Plain', 'givewp'), value: 'text/plain'},
                        ]}
                    />

                    <TextControl
                        label={__('Email', 'givewp')}
                        help={__('This email is automatically sent to the individual fundraiser and the recipient cannot be customized.', 'givewp')}
                        onChange={() => null}
                        value={''}
                    />
                </>
            )}

        </div>
    )
}

export default EmailTemplateSettings;
