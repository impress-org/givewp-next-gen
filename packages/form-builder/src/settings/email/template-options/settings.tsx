import {useEffect, useRef} from "react";
import {setFormSettings, useFormState, useFormStateDispatch} from "@givewp/form-builder/stores/form-state";
import {Button, RadioControl, SelectControl, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {Editor} from "@tinymce/tinymce-react";

import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import _ from "lodash";

const EmailTemplateSettings = ({notification}) => {

    const editorRef = useRef();

    useEffect(() => {
        const mediaToolbarButton = document.querySelector('.ql-wpmedia')
        if(mediaToolbarButton) {
            mediaToolbarButton.addEventListener('click', openMediaLibrary);
            return () => {
                mediaToolbarButton.removeEventListener('click', openMediaLibrary);
            }
        }
    }, []);

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

    _.noConflict();
    let frame;

    const openMediaLibrary = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (frame) {
            frame.open()
            return
        }

        frame = window.wp.media({
            title: 'Add or upload file',
            button: {
                text: 'Use this media',
            },
            multiple: false, // Set to true to allow multiple files to be selected
        })

        frame.on( 'select', function() {

            // Get media attachment details from the frame state
            var attachment = frame.state().get('selection').first().toJSON();

            // @ts-ignore
            const editor = editorRef.current.getEditor()
            const cursorPosition = editor.getSelection()?.index ?? 0;
            editor.insertEmbed(cursorPosition, 'image', attachment.url);
            editor.setSelection(cursorPosition + 1);
        });

        // Finally, open the modal on click
        frame.open()
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

                    {/*https://github.com/zenoamaro/react-quill*/}
                    <div className="text-editor">
                        <div id="toolbar">
                            <select
                                className="ql-header"
                                defaultValue={''}
                                onChange={(e) => e.persist()}
                            >
                                <option value="1"></option>
                                <option value="2"></option>
                                <option selected></option>
                            </select>
                            <button className="ql-bold"></button>
                            <button className="ql-italic"></button>
                            <button className="ql-blockquote"></button>
                            <button className="ql-link"></button>
                            <button className="ql-wpmedia" onClick={openMediaLibrary}>
                                <svg viewBox="0 0 18 18">
                                    <rect className="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                                    <circle className="ql-fill" cx="6" cy="7" r="1"></circle>
                                    <polyline className="ql-even ql-fill"
                                              points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                                </svg>
                            </button>
                        </div>

                        <ReactQuill
                            ref={editorRef}
                            theme="snow"
                            value={option.email_message}
                            onChange={(value) => updateEmailTemplateOption('email_message', value)}
                            modules={{
                                toolbar: {
                                    container: '#toolbar',
                                },
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image'
                            ]}
                        />
                    </div>

                    <SelectControl
                        onChange={(value) => updateEmailTemplateOption('content_type', value)}
                        label={__('Email content type', 'givewp')}
                        help={__('Choose email type', 'givewp')}
                        value={option.content_type || 'html'}
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
