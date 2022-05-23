import { useContext, useState } from 'react'

import {
    createSlotFill,
    TabPanel,
    PanelBody,
    PanelRow,
    TextControl,
    ToggleControl,
    RadioControl,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {FormTitleContext} from "../../context/formTitle";
import {useToggleState} from "../../hooks";

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
    'StandAloneBlockEditorSidebarInspector'
);

const FormTitle = () => {

    const [formTitle, setFormTitle] = useContext(FormTitleContext)

    return (
        <PanelBody>
            <PanelRow>
                <TextControl
                    label={__('Form Title')}
                    value={ formTitle }
                    onChange={ setFormTitle }
                />
            </PanelRow>
        </PanelBody>
    )
}

const DonationGoalSettings = () => {

    const {
        state: enableDonationGoal,
        toggle: toggleDonationGoal
    } = useToggleState( false )

    const {
        state: enableAutoClose,
        toggle: toggleAutoClose
    } = useToggleState( false )

    const goalFormatOptions = [
        {
            value: 'amount-raised',
            label: __( 'Amount Raised', 'give' ),
        },
        {
            value: 'percentage-raised',
            label: __( 'Percentage Raised', 'give' ),
        },
        {
            value: 'number-donations',
            label: __( 'Number of Donations', 'give' ),
        },
        {
            value: 'number-donors',
            label: __( 'Number of Donors', 'give' ),
        },
    ]

    const [ goalFormat, setGoalFormat ] = useState( goalFormatOptions[0].value );

    const [ goalAmount, setGoalAmount ] = useState( 10000 );

    return (
        <PanelBody title={ __( 'Donation Goal', 'give' ) } initialOpen={false}>
            <PanelRow>
                <ToggleControl
                    label={ __('Enable Donation Goal', 'give') }
                    help={ __('Do you want to set a donation goal for this form?', 'give') }
                    checked={enableDonationGoal}
                    onChange={toggleDonationGoal}
                />
            </PanelRow>

            { enableDonationGoal && (
                <>
                    <PanelRow>
                        <ToggleControl
                            label={ __('Auto-Close Form', 'give') }
                            help={ __('Do you want to close the donation forms and stop accepting donations once this goal has been met?', 'give') }
                            checked={enableAutoClose}
                            onChange={toggleAutoClose}
                        />
                    </PanelRow>
                    <PanelRow>
                        <NumberControl
                            label={ __('Goal Amount', 'give') }
                            min={ 0 }
                            value={ goalAmount }
                            onChange={ setGoalAmount }
                        />
                    </PanelRow>
                    <PanelRow>
                        <RadioControl
                            label={ __('Goal Format', 'give') }
                            help={ __('Do you want to display the total amount raised based on your monetary goal or a percentage? For instance, "$500 of $1,000 raised" or "50% funded" or "1 of 5 donations". You can also display a donor-based goal, such as "100 of 1,000 donors have given".', 'give') }
                            selected={ goalFormat }
                            options={ goalFormatOptions }
                            onChange={ setGoalFormat }
                        />
                    </PanelRow>
                </>
            )}
        </PanelBody>
    )
}

const OfflineDonations = () => {

    const {
        state: enableOfflineDonations,
        toggle: toggleOfflineDonations
    } = useToggleState( false )

    const {
        state: enableBillingFields,
        toggle: toggleBillingFields
    } = useToggleState( false )

    return (
        <PanelBody title={ __( 'Offline Donations', 'give' ) } initialOpen={false}>
            <PanelRow>
                <ToggleControl
                    label={ __('Enable Offline Donations', 'give') }
                    help={ __('Do you want to customize the donation instructions for this form?', 'give') }
                    checked={enableOfflineDonations}
                    onChange={toggleOfflineDonations}
                />
            </PanelRow>
            { enableOfflineDonations && (
                <>
                    <PanelRow>
                        <ToggleControl
                            label={ __('Enable Billing Fields', 'give') }
                            help={ __('DThis option will enable the billing details section for this form\'s offline donation payment gateway. The fieldset will appear above the offline donation instructions.', 'give') }
                            checked={enableBillingFields}
                            onChange={toggleBillingFields}
                        />
                    </PanelRow>
                    <PanelRow>
                        [DONATION INSTRUCTIONS HERE]
                    </PanelRow>
                </>
            )}
        </PanelBody>
    )
}

const tabs = [
    {
        name: 'form',
        title: __('Form'),
        className: 'tab-form',
        content: () => (
            <>
                <FormTitle />
                <DonationGoalSettings />
                <OfflineDonations />
            </>
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
                { ( tab ) => <tab.content /> }
            </TabPanel>
        </div>
    );
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
