import { useContext } from 'react'

import {createSlotFill, TabPanel, PanelHeader, PanelBody, PanelRow, TextControl} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {InspectorControls} from "@wordpress/block-editor";
import {FormSettingsContext} from "../../context/formSettings";

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
    'StandAloneBlockEditorSidebarInspector'
);

const tabs = [
    {
        name: 'form',
        title: __('Form'),
        className: 'tab-form',
        content: ({ formSettings, setFormSettings }) => (
            <PanelBody title={ __( 'Form Settings', 'give' ) } initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label={__('Form Title')}
                        value={ formSettings.formTitle }
                        onChange={ ( formTitle ) => {
                            setFormSettings({
                                ...formSettings,
                                formTitle: formTitle,
                            })
                        } }
                    />
                </PanelRow>
            </PanelBody>
        )
    },
    {
        name: 'block',
        title: __('Block'),
        className: 'tab-block',
        content: () => (
            <>
                <InspectorSlot bubblesVirtually />
            </>
        )
    },
]

function Sidebar() {
    const [formSettings, setFormSettings] = useContext(FormSettingsContext)
    return (
        <div
            className="givewp-next-gen-sidebar givewp-next-gen-sidebar-primary"
            role="region"
            aria-label={ __( 'Standalone Block Editor advanced settings.' ) }
            tabIndex="-1"
        >
            <TabPanel
                className="sidebar-panel"
                activeClass="active-tab"
                tabs={ tabs }
            >
                { ( tab ) => <tab.content formSettings={formSettings} setFormSettings={setFormSettings} /> }
            </TabPanel>
        </div>
    );
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
