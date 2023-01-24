import {PanelBody, SelectControl, ToggleControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {InspectorControls} from "@wordpress/block-editor";
import DeleteButton from "./delete-button";
import AddButton from "./add-button";
import {CurrencyControl} from "../../../../common/currency";
import {setFormSettings, useFormState} from "@givewp/form-builder/stores/form-state";
import {DonationOptionsSettings} from "@givewp/form-builder/settings";

const Inspector = ({attributes, setAttributes}) => {

    const {
        levels = ["10","25","50","100","250","500"],
        priceOption = "multi",
        setPrice = "100",
        customAmount = true,
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={__('Donation Options', 'give')} initialOpen={true}>
                <SelectControl
                    label={__('Donation Option', 'give')}
                    onChange={(priceOption) => setAttributes({priceOption})}
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
                        onValueChange={(setPrice) => setAttributes({setPrice})}
                    />
                )}
                <ToggleControl
                    label={__('Custom Amount', 'give')}
                    checked={customAmount}
                    onChange={() => setAttributes({customAmount: !customAmount})}
                />
            </PanelBody>
            {priceOption === 'multi' && (
                <PanelBody title={__('Donation Levels', 'give')} initialOpen={true}>
                {levels.length > 0 && (
                    <ul style={{
                        listStyleType: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {
                            levels.map((amount, index) => {
                                return (
                                    <li key={'level-option-inspector-' + index} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <CurrencyControl
                                            value={amount}
                                            onValueChange={(value) => {
                                                const newLevels = [...levels];

                                                newLevels[index] = value;
                                                setAttributes({levels: newLevels});
                                            }}
                                        />
                                        <DeleteButton onClick={() => {
                                            levels.splice(index, 1);
                                            setAttributes({levels: levels.slice()});
                                        }} />
                                    </li>
                                );
                            })
                        }
                    </ul>
                )}
                <AddButton onClick={() => {
                    const newLevels = [...levels];
                    newLevels.push('');
                    setAttributes({levels: newLevels});
                }} />
            </PanelBody>
            )}
        </InspectorControls>
    );
};

export default Inspector;
