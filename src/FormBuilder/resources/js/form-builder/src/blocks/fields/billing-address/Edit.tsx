import {__} from '@wordpress/i18n';
import {BlockEditProps} from '@wordpress/blocks';
import {PanelBody, PanelRow, SelectControl, TextControl, ToggleControl} from '@wordpress/components';
import {InspectorControls} from '@wordpress/block-editor';
import {useState} from 'react';

const CountrySelect = ({countryList}) => {
    const [selectedCountry, setSelectedCountry] = useState(countryList[0] ?? '');
    const countryOptions = countryList.map((country) => {
        return {
            label: country.label,
            value: country.value,
        };
    });
    return (
        <SelectControl
            label={__('Country', 'give')}
            required={true}
            className={'give-is-required'}
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
        />
    );
};

export default function Edit({
    attributes: {
        country,
        address1Label,
        address1Placeholder,
        address2Label,
        address2Placeholder,
        requireAddress2,
        cityLabel,
        cityPlaceholder,
        stateLabel,
        statePlaceholder,
        zipLabel,
        zipPlaceholder,
    },
    setAttributes,
}: BlockEditProps<any>) {
    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateAreas: `
                    "country country"
                    "address1 address1"
                    "address2 address2"
                    "city state"
                    "zip zip"
                    `,
                    gridAutoColumns: '1fr',
                    gap: '15px',
                }}
            >
                <div style={{gridArea: 'country'}}>
                    <CountrySelect countryList={country} />
                </div>
                <div style={{gridArea: 'address1'}}>
                    <TextControl
                        label={address1Label}
                        placeholder={address1Placeholder}
                        required={true}
                        className={'give-is-required'}
                        readOnly
                        value={address1Placeholder}
                        onChange={null}
                    />
                </div>
                <div style={{gridArea: 'address2'}}>
                    <TextControl
                        label={address2Label}
                        placeholder={address2Placeholder}
                        required={requireAddress2}
                        className={`${requireAddress2 ? 'give-is-required' : ''}`}
                        value={address2Placeholder}
                        onChange={null}
                        readOnly
                    />
                </div>
                <div style={{gridArea: 'city'}}>
                    <TextControl
                        label={cityLabel}
                        placeholder={cityPlaceholder}
                        required={true}
                        className={'give-is-required'}
                        readOnly
                        value={cityPlaceholder}
                        onChange={null}
                    />
                </div>
                <div style={{gridArea: 'state'}}>
                    <TextControl
                        label={stateLabel}
                        placeholder={statePlaceholder}
                        required={true}
                        className={'give-is-required'}
                        value={statePlaceholder}
                        onChange={null}
                        readOnly
                    />
                </div>
                <div style={{gridArea: 'zip'}}>
                    <TextControl
                        label={zipLabel}
                        placeholder={zipPlaceholder}
                        required={true}
                        className={'give-is-required'}
                        value={zipPlaceholder}
                        onChange={null}
                        readOnly
                    />
                </div>
            </div>

            <InspectorControls>
                {/*<PanelBody title={__('Name Title Prefix', 'give')} initialOpen={true}>
                    <PanelRow>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <div>
                                <!-- Wrapper added to control spacing between control and help text. -->
                                <ToggleControl
                                    label={__('Show Name Title Prefix', 'give')}
                                    checked={showHonorific}
                                    onChange={() => setAttributes({showHonorific: !showHonorific})}
                                    help={__(
                                        "Do you want to add a name title prefix dropdown field before the donor's first name field? This will display a dropdown with options such as Mrs, Miss, Ms, Sir, and Dr for the donor to choose from.",
                                        'give'
                                    )}
                                />
                            </div>
                            {!!showHonorific && (
                                <FormTokenField
                                    tokenizeOnSpace={true}
                                    label={__('Title Prefixes', 'give')}
                                    value={honorifics}
                                    suggestions={['Mr', 'Ms', 'Mrs']}
                                    // placeholder={__('Select some options', 'give')}
                                    onChange={(tokens) => setAttributes({honorifics: tokens})}
                                    displayTransform={titleLabelTransform}
                                    saveTransform={titleValueTransform}
                                />
                            )}
                        </div>
                    </PanelRow>
                </PanelBody>*/}
                <PanelBody title={__('Address Line 1', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={address1Label}
                            onChange={(value) => setAttributes({address1Label: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={address1Placeholder}
                            onChange={(value) => setAttributes({address1Placeholder: value})}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('Address Line 2', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={address2Label}
                            onChange={(value) => setAttributes({address2Label: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={address2Placeholder}
                            onChange={(value) => setAttributes({address2Placeholder: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Required', 'give')}
                            checked={requireAddress2}
                            onChange={() => setAttributes({requireAddress2: !requireAddress2})}
                            help={__('Do you want to force the Address Line 2 field to be required?', 'give')}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('City', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={cityLabel}
                            onChange={(value) => setAttributes({cityLabel: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={cityPlaceholder}
                            onChange={(value) => setAttributes({cityPlaceholder: value})}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('State/Province/Country', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={stateLabel}
                            onChange={(value) => setAttributes({stateLabel: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={statePlaceholder}
                            onChange={(value) => setAttributes({statePlaceholder: value})}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('Zip/Postal Code', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={zipLabel}
                            onChange={(value) => setAttributes({zipLabel: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={zipPlaceholder}
                            onChange={(value) => setAttributes({zipPlaceholder: value})}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        </>
    );
}
