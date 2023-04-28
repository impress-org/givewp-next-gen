import {useRef} from "react";
import {setFormSettings, useFormState, useFormStateDispatch} from "@givewp/form-builder/stores/form-state";
import {RadioControl, SelectControl, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {Editor} from "@tinymce/tinymce-react";

const EmailTemplateSettings = ({notification}) => {

    const editorRef = useRef(null);

    const dispatch = useFormStateDispatch();
    const {settings: {emailTemplateOptions}} = useFormState();

    const option = emailTemplateOptions[notification] ?? { 'email_subject': '' };

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
                selected={option.status ?? 'global'}
                options={[
                    {label: __('Global option', 'givewp'), value: 'global'},
                    {label: __('Customize', 'givewp'), value: 'enabled'},
                    {label: __('Disabled', 'givewp'), value: 'disabled'},
                ]}
                onChange={(value) => updateEmailTemplateOption('status', value)}
            />

            {'enabled' === option.status && (
                <>
                    <TextControl
                        label={__('Email Subject', 'givewp')}
                        help={__('Enter the email subject line', 'givewp')}
                        onChange={(value) => updateEmailTemplateOption('email_subject', value)}
                        value={option.email_subject}
                    />

                    <TextControl
                        label={__('Email Header', 'givewp')}
                        help={__('Enter the email header that appears at the top of the email', 'givewp')}
                        onChange={(value) => updateEmailTemplateOption('email_heading', value)}
                        value={option.email_heading}
                    />

                    <Editor
                        onInit={(evt, editor) => editorRef.current = editor}
                        // onEditorChange={(content, editor) => {console.log(content)}}
                        initialValue={''}
                        init={{
                            height: 300,
                            menubar: false,
                            statusbar: false,
                            // plugins: [
                            //     'advlist autolink lists link image charmap print preview anchor',
                            //     'searchreplace visualblocks code fullscreen',
                            //     'insertdatetime media table paste code help wordcount'
                            // ],
                            // toolbar: 'undo redo | formatselect | ' +
                            //     'bold italic backcolor | alignleft aligncenter ' +
                            //     'alignright alignjustify | bullist numlist outdent indent | ' +
                            //     'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />

                    <SelectControl
                        onChange={() => null}
                        label={__('Email content type', 'givewp')}
                        help={__('Choose email type', 'givewp')}
                        value={'html'}
                        options={[
                            {label: __('HTML', 'givewp'), value: 'html'},
                            {label: __('Plain', 'givewp'), value: 'plain'},
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
