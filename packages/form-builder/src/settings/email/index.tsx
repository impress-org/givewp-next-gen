import {__} from "@wordpress/i18n";
import {
    Button,
    Modal,
    PanelBody,
    PanelRow,
    TextControl,
    RadioControl, SelectControl, Autocomplete,
} from "@wordpress/components";
import {useRef, useState} from "react";
import {edit, copy} from "@wordpress/icons";
import TabPanel from "@givewp/form-builder/components/sidebar/TabPanel";
import { Editor } from '@tinymce/tinymce-react';
import {getFormBuilderData} from "@givewp/form-builder/common/getWindowData";
import useClipboard from "react-use-clipboard";

const CopyToClipboardButton = ({text}) => {
    const [isCopied, setCopied] = useClipboard(text, {
        successDuration: 1000,
    });
    const label = isCopied
        ? __('Copied!', 'givewp')
        : __('Copy tag', 'givewp');
    return (
        <Button
            variant={'tertiary'}
            icon={copy}
            onClick={setCopied}
        >
            {label}
        </Button>
    )
}

const EmailTemplateSettings = ({config}) => {

    console.log(config)

    const editorRef = useRef(null);

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
                help={__('Global options are set in GIveWP settings. You may override them for this form here', 'givewp')}
                selected={'enabled'}
                options={[
                    {label: __('Global option', 'givewp'), value: 'global'},
                    {label: __('Customize', 'givewp'), value: 'enabled'},
                    {label: __('Disabled', 'givewp'), value: 'disabled'},
                ]}
                onChange={( value ) => null}
            />

            <TextControl
                label={__('Email Subject', 'givewp')}
                help={__('Enter the email subject line', 'givewp')}
                onChange={() => null}
                value={config.default_email_subject}
            />

            <TextControl
                label={__('Email Header', 'givewp')}
                help={__('Enter the email header that appears at the top of the email', 'givewp')}
                onChange={() => null}
                value={config.default_email_header}
            />

            <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                onEditorChange={(content, editor) => {console.log(content)}}
                initialValue={config.default_email_message}
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

        </div>
    )
}

const EmailSettings = () => {

    const [ isOpen, setOpen ] = useState<boolean>( true );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );

    const [ selectedTab, setSelectedTab ] = useState<string>();

    const {templateTags, emailNotifications, emailNotificationConfigs} = getFormBuilderData();

    return <>
        <PanelBody title={__('Email Settings', 'givewp')} initialOpen={false}>
            <PanelRow>
                <Button icon={edit} onClick={ openModal } variant={'primary'}>
                    { __( 'Customize email templates', 'givewp' ) }
                </Button>
            </PanelRow>
        </PanelBody>
        {isOpen && (
            <Modal
                title={__('Email Settings', 'give')}
                onRequestClose={closeModal}
                isDismissible={false}
                shouldCloseOnClickOutside={false}
                style={{
                    margin: 'var(--givewp-spacing-10)',
                    width: '100%',
                    height: '90%',
                    maxHeight: '90%',
                    display: 'flex',
                }}
            >
                <Button
                    variant={'primary'}
                    onClick={ closeModal }
                    style={{
                        zIndex: 11, // Above the modal header
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: 'var(--givewp-spacing-4) var(--givewp-spacing-6)',
                        margin: 'var(--givewp-spacing-4) var(--givewp-spacing-6)',
                    }}
                >
                    {__('Set and close', 'givewp')}
                </Button>

                <div style={{ display: 'flex', gap: 'var(--givewp-spacing-10)', height: '100%', overflow: 'hidden', flex: 1}}>
                    <div style={{ flex: '2'}}>
                        <TabPanel
                            className={'email-settings-modal-tabs'}
                            orientation={'vertical' as 'horizontal' | 'vertical' | 'both'}
                            tabs={emailNotifications.map((notification) => {
                                return {
                                    name: notification.id,
                                    title: notification.title,
                                    content: () => (
                                        <>
                                            <EmailTemplateSettings config={emailNotificationConfigs.find((n) => n.id === notification.id)} />
                                        </>
                                    ),
                                }
                            })}
                            initialTabName={emailNotifications[0].id}
                            state={[selectedTab, setSelectedTab]}
                        >
                            {(tab) => (
                                <div style={{
                                    height: '100%',
                                    overflowX: 'hidden',
                                    overflowY: 'scroll',
                                    padding: '20px', // Adjust for scrollbar
                                }}>
                                    <h2 style={{margin:0}}>Notification</h2>
                                    <p></p>
                                    <tab.content />
                                </div>
                            )}
                        </TabPanel>
                    </div>
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--givewp-spacing-6)',
                        paddingRight: '10px', // Adjust for overflow
                    }}>
                        <div style={{flex:1}}>
                            <h2 style={{margin: 0}}>{__('Preview email', 'givewp')}</h2>
                            <p>{__('Specify below the email address you want to send a test email to', 'givewp')}</p>
                            <Button variant={'secondary'} style={{width:'100%',justifyContent:'center'}}>{__('Preview email', 'givewp')}</Button>
                        </div>
                        <div style={{flex:1}}>
                            <TextControl
                                label={__('Email address', 'givewp')}
                                help={__('Specify below the email address you want to send a test email to', 'givewp')}
                                onChange={() => null}
                                value={''}
                            />
                            <Button variant={'secondary'} style={{width:'100%',justifyContent:'center'}}>{__('Send test email', 'givewp')}</Button>
                        </div>
                        <div style={{flex:3}}>
                            <h2 style={{margin: 0}}>{__('Template tags', 'givewp')}</h2>
                            <p>{__('Available template tags for this email. HTML is accepted. See our documentation for examples of how to use custom meta email tags to output additional donor or donation information in your GiveWP emails', 'givewp')}</p>
                            <ul className={'email-template-tags'}>
                                {templateTags.map((tag) => (
                                    <li key={tag.tag}>
                                        <strong>{'{' + tag.tag + '}'}</strong>
                                        <p>{tag.desc}</p>
                                        <CopyToClipboardButton text={'{' + tag.tag + '}'} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        )}
    </>
}

export default EmailSettings;
