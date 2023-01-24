import {
    PanelBody,
    SelectControl, ToggleControl,
} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormState, useFormStateDispatch} from '@givewp/form-builder/stores/form-state';

import {CurrencyControl} from "@givewp/form-builder/common/currency";

const DonationOptionsSettings = ({ initialOpen = false }) => {
    const {
        settings: {priceOption, setPrice, customAmount},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    return (
        <PanelBody title={__('Donation Options', 'give')} initialOpen={initialOpen}>
            <SelectControl
                label={__('Donation Option', 'give')}
                onChange={(priceOption) => dispatch(setFormSettings({priceOption}))}
                value={priceOption}
                options={[
                    {label: __('Multi-level Donation', 'give'), value: 'multi'},
                    {label: __('Fixed Donation', 'give'), value: 'set'},
                ]}
            />
            {priceOption === 'set' && (
                <CurrencyControl
                    label={__('Set Donation', 'give')}
                    value={setPrice}
                    onValueChange={(setPrice) => dispatch(setFormSettings({setPrice}))}
                />
            )}
            <ToggleControl
                label={__('Custom Amount', 'give')}
                checked={customAmount}
                onChange={() => dispatch(setFormSettings({customAmount: !customAmount}))}
            />
        </PanelBody>
    );
};

export default DonationOptionsSettings;
