import {
    PanelBody,
    SelectControl,
    ToggleControl,
    PanelRow, CheckboxControl, BaseControl,
} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {InspectorControls} from "@wordpress/block-editor";
import DeleteButton from "./delete-button";
import AddButton from "./add-button";
import {CurrencyControl} from "../../../../common/currency";

const Inspector = ({attributes, setAttributes}) => {

    const {
        levels,
        priceOption,
        setPrice,
        customAmount,
        customAmountMin,
        customAmountMax,
        recurringEnabled,
        recurringDonationChoice,
        recurringPeriod,
        recurringBillingInterval,
        recurringBillingPeriod,
        recurringLengthOfTime,
        recurringOptInDefault,
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
                    help={ 'multi' === priceOption ? __('Set multiple price donations for this form.', 'give') : __('The donation amount is fixed to the following amount:', 'give')}
                />
                {priceOption === 'set' && (
                    <CurrencyControl
                        label={__('Set Donation', 'give')}
                        value={setPrice}
                        onValueChange={(setPrice) => setAttributes({setPrice})}
                    />
                )}
            </PanelBody>
            <PanelBody title={__('Custom Amount', 'give')} initialOpen={false}>
                <ToggleControl
                    label={__('Custom Amount', 'give')}
                    checked={customAmount}
                    onChange={() => setAttributes({customAmount: !customAmount})}
                />
                { !!customAmount && (
                    <>
                        <CurrencyControl label={__('Minimum', 'give')} value={customAmountMin} onValueChange={(value) => setAttributes({customAmountMin: value})} />
                        <CurrencyControl label={__('Maximum', 'give')} value={customAmountMax} onValueChange={(value) => setAttributes({customAmountMax: value})} />
                    </>
                )}
            </PanelBody>
            {priceOption === 'multi' && (
                <PanelBody title={__('Donation Levels', 'give')} initialOpen={false}>
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
                                    }} className={'givewp-donation-level-control'}>
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
            <PanelBody title={__('Recurring donation', 'give')} initialOpen={false}>
                <PanelRow>
                    <ToggleControl
                        label={__('Enable recurring donation', 'give')}
                        checked={recurringEnabled}
                        onChange={() => setAttributes({recurringEnabled: !recurringEnabled})}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label={__('Donation choice', 'give')}
                        options={[
                            {label: __('Admin', 'give'), value: 'admin'},
                            {label: __('Donor', 'give'), value: 'donor'},
                        ]}
                        value={recurringDonationChoice}
                        onChange={(recurringDonationChoice) => setAttributes({recurringDonationChoice})}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label={__('Recurring period', 'give')}
                        help={__('This option provides only the selected period for the donor’s subscription.', 'give')}
                        options={[
                            {label: __('Preset choice', 'give'), value: 'preset'},
                        ]}
                        value={'preset'}
                        onChange={() => null}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label={__('Billing interval', 'give')}
                        options={[
                            {label: __('Every', 'give'), value: 'every'},
                        ]}
                        value={'every'}
                        onChange={() => null}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label={__('Billing period', 'give')}
                        options={[
                            {label: __('Monthly', 'give'), value: 'monthly'},
                            {label: __('Yearly', 'give'), value: 'yearly'},
                        ]}
                        value={'monthly'}
                        onChange={() => null}
                    />
                </PanelRow>
                <PanelRow>
                    <BaseControl id={'foo'} label={__('Billing period', 'give')}>
                        <div style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                        }}>
                        <CheckboxControl
                            label={__('Days', 'give')}
                            checked={false}
                            onChange={() => null}
                            __nextHasNoMarginBottom={true}
                        />
                        <CheckboxControl
                            label={__('Weeks', 'give')}
                            checked={false}
                            onChange={() => null}
                            __nextHasNoMarginBottom={true}
                        />
                        <CheckboxControl
                            label={__('Months', 'give')}
                            checked={false}
                            onChange={() => null}
                            __nextHasNoMarginBottom={true}
                        />
                        <CheckboxControl
                            label={__('Quarters', 'give')}
                            checked={false}
                            onChange={() => null}
                            __nextHasNoMarginBottom={true}
                        />
                        <CheckboxControl
                            label={__('Years', 'give')}
                            checked={false}
                            onChange={() => null}
                            __nextHasNoMarginBottom={true}
                        />
                        </div>
                    </BaseControl>
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label={__('Length of time', 'give')}
                        options={[
                            {label: __('Ongoing', 'give'), value: 'ongoing'},
                        ]}
                        value={'ongoing'}
                        onChange={() => null}
                    />
                </PanelRow>
                <PanelRow>
                    <ToggleControl
                        label={__('Recurring opt-in default', 'give')}
                        checked={false}
                        onChange={() => null}
                    />
                </PanelRow>
            </PanelBody>
        </InspectorControls>
    );
};

export default Inspector;
