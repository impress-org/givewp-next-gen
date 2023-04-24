import {__} from "@wordpress/i18n";
import {Button, Modal, PanelBody, PanelRow, TextControl} from "@wordpress/components";
import {useState} from "react";
import {edit} from "@wordpress/icons";
import TabPanel from "@givewp/form-builder/components/sidebar/TabPanel";

const tabs = [
    {
        name: 'new-donation',
        title: __('New Donation'),
        className: 'tab--new-donation',
        content: () => (
            <>
                <TextControl
                    label={__('Email Subject', 'givewp')}
                    help={__('Enter the email subject line', 'givewp')}
                    onChange={() => null}
                    value={null}
                />
            </>
        ),
    },
    {
        name: 'donation-receipt',
        title: __('Donation Receipt'),
        className: 'tab--donation-receipt',
        content: () => (
            <>
                DONATION RECEIPT SETTINGS
            </>
        ),
    },
]

const EmailSettings = () => {

    const [ isOpen, setOpen ] = useState<boolean>( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );

    const [ selectedTab, setSelectedTab ] = useState<string>();

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
                style={{
                    width: '90%',
                    height: '80%',
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

                <div style={{ display: 'flex', gap: 'var(--givewp-spacing-10)' }}>
                    <div style={{ flex: '2'}}>
                        <TabPanel
                            className={'email-settings-modal-tabs'}
                            orientation={'vertical' as 'horizontal' | 'vertical' | 'both'}
                            tabs={tabs}
                            initialTabName={tabs[0].name}
                            state={[selectedTab, setSelectedTab]}
                        >
                            {(tab) => (
                                <div>
                                    <h2 style={{margin:0}}>Notification</h2>
                                    <p></p>
                                    <tab.content />
                                </div>
                            )}
                        </TabPanel>
                    </div>
                    <div style={{ flex: '1'}}>
                        <h2 style={{margin: 0}}>{__('Preview email', 'givewp')}</h2>
                        <p>{__('Specify below the email address you want to send a test email to', 'givewp')}</p>
                        <Button variant={'secondary'}>{__('Preview email', 'givewp')}</Button>
                    </div>
                </div>
            </Modal>
        )}
    </>
}

export default EmailSettings;
