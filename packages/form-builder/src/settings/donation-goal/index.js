import {setFormSettings, useFormState, useFormStateDispatch} from '@givewp/form-builder/stores/form-state';
import {__} from '@wordpress/i18n';
import {
    __experimentalNumberControl as NumberControl,
    PanelBody,
    PanelRow,
    SelectControl,
    ToggleControl,
} from '@wordpress/components';

const DonationGoalSettings = () => {
    const {
        settings: {enableDonationGoal, enableAutoClose, goalType, goalAmount},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    // @todo Starting with just the Amount Raised goal format.
    const goalTypeOptions = [
        {
            value: 'amount',
            label: __('Amount Raised', 'give'),
        },
        // {
        //     value: 'donations',
        //     label: __('Number of Donations', 'give'),
        // },
        // {
        //     value: 'donors',
        //     label: __('Number of Donors', 'give'),
        // },
    ];

    return (
        <PanelBody title={__('Donation Goal', 'give')} initialOpen={false}>
            <PanelRow>
                <ToggleControl
                    label={__('Enable Donation Goal', 'give')}
                    help={__('Do you want to set a donation goal for this form?', 'give')}
                    checked={enableDonationGoal}
                    onChange={() => {
                        dispatch(setFormSettings({enableDonationGoal: !enableDonationGoal}));
                    }}
                />
            </PanelRow>

            {enableDonationGoal && (
                <>
                    <PanelRow>
                        <ToggleControl
                            label={__('Auto-Close Form', 'give')}
                            help={__(
                                'Do you want to close the donation forms and stop accepting donations once this goal has been met?',
                                'give'
                            )}
                            checked={enableAutoClose}
                            onChange={() => dispatch(setFormSettings({enableAutoClose: !enableAutoClose}))}
                        />
                    </PanelRow>
                    <PanelRow>
                        <SelectControl
                            label={__('Goal Type', 'give')}
                            value={goalType}
                            options={goalTypeOptions}
                            onChange={(goalType) => dispatch(setFormSettings({goalType: goalType}))}
                        />
                    </PanelRow>
                    <PanelRow>
                        {/*
                            @todo Do we need to reset the goal amount when the goal format changes?
                                The context can be wildly different, ie Amount Raised vs Number of Donors.
                                Perhaps we could implement smart default amounts for each goal format?
                        */}
                        <NumberControl
                            label={__('Goal Amount', 'give')}
                            min={0}
                            value={goalAmount}
                            onChange={(goalAmount) => dispatch(setFormSettings({goalAmount}))}
                        />
                    </PanelRow>
                </>
            )}
        </PanelBody>
    );
};

export default DonationGoalSettings;
