import {createSlotFill} from '@wordpress/components';
import {__} from '@wordpress/i18n';

import TabPanel from './tab-panel';

import {DonationGoalSettings, FormTitleSettings, OfflineDonationsSettings} from '../../settings';
import FormFields from "../../settings/form-fields";
import {PopoutSlot} from "./popout";
import {useSelect} from "@wordpress/data";
import {store as blockEditorStore} from "@wordpress/block-editor/build/store";
import {useState} from "@wordpress/element";
import {useEffect} from "react";

const {Slot: InspectorSlot, Fill: InspectorFill} = createSlotFill(
    'StandAloneBlockEditorSidebarInspector',
);

const tabs = [
    {
        name: 'form',
        title: __('Form'),
        className: 'tab-form',
        content: () => (
            <>
                <FormTitleSettings />
                <DonationGoalSettings />
                <OfflineDonationsSettings />
                <FormFields />
            </>
        ),
    },
    {
        name: 'block',
        title: __('Block'),
        className: 'tab-block',
        content: () => (
            <>
                <InspectorSlot bubblesVirtually />
            </>
        ),
    },
];

function Sidebar() {

    const [selectedTab, setSelectedTab] = useState(null);

    const {
        selectedBlocks,
    } = useSelect(select => {
        const {
            getSelectedBlockClientIds,
        } = select(blockEditorStore);
        return {
            selectedBlocks: getSelectedBlockClientIds(),
        };
    });

    useEffect(
        () => {
            if (selectedBlocks.length) setSelectedTab('block');
        }
        , [selectedBlocks], // only run effect when workspaceID changes
    );

    return (
        <div
            className="givewp-next-gen-sidebar givewp-next-gen-sidebar-primary"
            role="region"
            aria-label={__('Standalone Block Editor advanced settings.')}
            tabIndex="-1"
        >
            <PopoutSlot />
            <TabPanel
                className="sidebar-panel"
                activeClass="active-tab"
                tabs={tabs}
                state={[selectedTab, setSelectedTab]}
            >
                {(tab) => <tab.content />}
            </TabPanel>
        </div>
    );
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
