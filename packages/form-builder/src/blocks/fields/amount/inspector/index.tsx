import {BaseControl, CheckboxControl, PanelBody, PanelRow, SelectControl, ToggleControl} from '@wordpress/components';
import {__, sprintf} from '@wordpress/i18n';
import {InspectorControls} from '@wordpress/block-editor';
import DeleteButton from './delete-button';
import AddButton from './add-button';
import {CurrencyControl} from '@givewp/form-builder/common/currency';
import periodLookup from '../period-lookup';

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
        recurringBillingInterval,
        recurringBillingPeriod,
        recurringBillingPeriodOptions,
        recurringLengthOfTime,
        recurringOptInDefaultBillingPeriod,
    } = attributes;

    const addBillingPeriodOption = (value) => {
        setAttributes({
            recurringBillingPeriodOptions: Array.from(new Set(recurringBillingPeriodOptions.concat([value]))),
        });
    };
    const removeBillingPeriodOption = (value) => {
        if(recurringBillingPeriodOptions.length > 1) {
            setAttributes({
                recurringBillingPeriodOptions: recurringBillingPeriodOptions.filter((option) => option !== value),
            });
        }
    };

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
                    help={
                        'multi' === priceOption
                            ? __('Set multiple price donations for this form.', 'give')
                            : __('The donation amount is fixed to the following amount:', 'give')
                    }
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
                {!!customAmount && (
                    <>
                        <CurrencyControl
                            label={__('Minimum', 'give')}
                            value={customAmountMin}
                            onValueChange={(value) => setAttributes({customAmountMin: value})}
                        />
                        <CurrencyControl
                            label={__('Maximum', 'give')}
                            value={customAmountMax}
                            onValueChange={(value) => setAttributes({customAmountMax: value})}
                        />
                    </>
                )}
            </PanelBody>
            {priceOption === 'multi' && (
                <PanelBody title={__('Donation Levels', 'give')} initialOpen={false}>
                    {levels.length > 0 && (
                        <ul
                            style={{
                                listStyleType: 'none',
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                            }}
                        >
                            {levels.map((amount, index) => {
                                return (
                                    <li
                                        key={'level-option-inspector-' + index}
                                        style={{
                                            display: 'flex',
                                            gap: '16px',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        className={'givewp-donation-level-control'}
                                    >
                                        <CurrencyControl
                                            value={amount}
                                            onValueChange={(value) => {
                                                const newLevels = [...levels];

                                                newLevels[index] = value;
                                                setAttributes({levels: newLevels});
                                            }}
                                            label="Donation amount Level"
                                            hideLabelFromVision
                                        />
                                        <DeleteButton
                                            onClick={() => {
                                                levels.splice(index, 1);
                                                setAttributes({levels: levels.slice()});
                                            }}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <AddButton
                        onClick={() => {
                            const newLevels = [...levels];
                            newLevels.push('');
                            setAttributes({levels: newLevels});
                        }}
                    />
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
                {!!recurringEnabled && (
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
                )}
                {!!recurringEnabled && (
                    <PanelRow>
                        <SelectControl
                            label={__('Billing interval', 'give')}
                            options={[
                                {label: __('Every', 'give'), value: "1"},
                                {label: __('Every 2nd', 'give'), value: "2"},
                                {label: __('Every 3rd', 'give'), value: "3"},
                                {label: __('Every 4th', 'give'), value: "4"},
                                {label: __('Every 5th', 'give'), value: "5"},
                                {label: __('Every 6th', 'give'), value: "6"},
                            ]}
                            value={recurringBillingInterval}
                            onChange={(recurringBillingInterval) => setAttributes({recurringBillingInterval})}
                        />
                    </PanelRow>
                )}
                {!!recurringEnabled && (
                    <PanelRow>
                        {'admin' === recurringDonationChoice && (
                            <SelectControl
                                label={__('Billing period', 'give')}
                                options={[
                                    {label: __('Day', 'give'), value: 'day'},
                                    {label: __('Week', 'give'), value: 'week'},
                                    {label: __('Month', 'give'), value: 'month'},
                                    {label: __('Quarter', 'give'), value: 'quarter'},
                                    {label: __('Year', 'give'), value: 'year'},
                                ]}
                                value={recurringBillingPeriod}
                                onChange={(recurringBillingPeriod) =>
                                    setAttributes({recurringBillingPeriod: [recurringBillingPeriod]})
                                }
                            />
                        )}
                        {'donor' === recurringDonationChoice && (
                            <BaseControl id={'recurringBillingPeriodOptions'} label={__('Billing period', 'give')}>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                    }}
                                >
                                    {[
                                        {label: __('Day', 'give'), value: 'day'},
                                        {label: __('Week', 'give'), value: 'week'},
                                        {label: __('Month', 'give'), value: 'month'},
                                        {label: __('Quarter', 'give'), value: 'quarter'},
                                        {label: __('Year', 'give'), value: 'year'},
                                    ].map((option) => (
                                        <CheckboxControl
                                            key={option.value}
                                            label={option.label}
                                            checked={recurringBillingPeriodOptions.includes(option.value)}
                                            onChange={(checked) =>
                                                checked
                                                    ? addBillingPeriodOption(option.value)
                                                    : removeBillingPeriodOption(option.value)
                                            }
                                            disabled={
                                                recurringBillingPeriodOptions.length === 1
                                                && recurringBillingPeriodOptions.includes(option.value) // This is the last checked option.
                                            }
                                            //@ts-ignore
                                            __nextHasNoMarginBottom={true}
                                        />
                                    ))}
                                </div>
                            </BaseControl>
                        )}
                    </PanelRow>
                )}
                {!!recurringEnabled && 'donor' === recurringDonationChoice && (
                    <PanelRow>
                        <SelectControl
                            label={__('Default billing period', 'give')}
                            value={recurringOptInDefaultBillingPeriod ?? 'month'}
                            options={['one-time'].concat(recurringBillingPeriodOptions).map((value) => ({
                                label: periodLookup[value].singular.toUpperCase(),
                                value: value,
                            }))}
                            onChange={(recurringOptInDefaultBillingPeriod) => setAttributes({recurringOptInDefaultBillingPeriod})}
                        />
                    </PanelRow>
                )}
                {!!recurringEnabled && (
                    <PanelRow>
                        <SelectControl
                            label={__('Number of Payments', 'give')}
                            //@ts-ignore
                            options={[{label: __('Ongoing', 'give'), value: 0}].concat(
                                [...Array(24 + 1).keys()].slice(2).map((value) => ({
                                    label: sprintf(__('%d payments', 'give'), value),
                                    value: value,
                                }))
                            )}
                            value={recurringLengthOfTime}
                            onChange={(recurringLengthOfTime) => setAttributes({recurringLengthOfTime})}
                        />
                    </PanelRow>
                )}
            </PanelBody>
        </InspectorControls>
    );
};

export default Inspector;
