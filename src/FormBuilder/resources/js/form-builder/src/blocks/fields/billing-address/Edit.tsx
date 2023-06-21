import {__} from '@wordpress/i18n';
import {BlockEditProps} from '@wordpress/blocks';
import {PanelBody, PanelRow, SelectControl, TextControl, ToggleControl} from '@wordpress/components';
import {InspectorControls} from '@wordpress/block-editor';
import {useState} from 'react';

const HonorificSelect = ({honorifics}) => {
    const [selectedTitle, setSelectedTitle] = useState(honorifics[0] ?? '');
    const honorificOptions = honorifics.map((token) => {
        return {
            label: titleLabelTransform(token),
            value: titleValueTransform(token),
        };
    });
    return (
        <SelectControl
            label={__('Title', 'give')}
            options={honorificOptions}
            value={selectedTitle}
            onChange={setSelectedTitle}
        />
    );
};

const titleLabelTransform = (token = '') => token.charAt(0).toUpperCase() + token.slice(1);
const titleValueTransform = (token = '') => token.trim().toLowerCase();

export default function Edit({
    attributes: {
        showHonorific,
        honorifics,
        addressLine1Label,
        addressLine1Placeholder,
        addressLine2Label,
        addressLine2Placeholder,
        requireAddressLine2,
    },
    setAttributes,
}: BlockEditProps<any>) {
    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: showHonorific ? '1fr 2fr 2fr' : '1fr 1fr',
                    gap: '15px',
                }}
            >
                {/*!!showHonorific && <HonorificSelect honorifics={honorifics} />*/}
                <TextControl
                    label={addressLine1Label}
                    placeholder={addressLine1Placeholder}
                    required={true}
                    className={'give-is-required'}
                    readOnly
                    value={addressLine1Placeholder}
                    onChange={null}
                />
                <TextControl
                    label={addressLine2Label}
                    placeholder={addressLine2Placeholder}
                    required={requireAddressLine2}
                    className={`${requireAddressLine2 ? 'give-is-required' : ''}`}
                    value={addressLine2Placeholder}
                    onChange={null}
                    readOnly
                />
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
                            value={addressLine1Label}
                            onChange={(value) => setAttributes({addressLine1Label: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={addressLine1Placeholder}
                            onChange={(value) => setAttributes({addressLine1Placeholder: value})}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('Address Line 2', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Label')}
                            value={addressLine2Label}
                            onChange={(value) => setAttributes({addressLine2Label: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Placeholder')}
                            value={addressLine2Placeholder}
                            onChange={(value) => setAttributes({addressLine2Placeholder: value})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Required', 'give')}
                            checked={requireAddressLine2}
                            onChange={() => setAttributes({requireAddressLine2: !requireAddressLine2})}
                            help={__('Do you want to force the Address Line 2 field to be required?', 'give')}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        </>
    );
}
