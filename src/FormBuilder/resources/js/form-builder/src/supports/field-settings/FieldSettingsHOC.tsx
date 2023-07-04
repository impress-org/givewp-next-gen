import {InspectorControls, InspectorAdvancedControls} from '@wordpress/block-editor';
import {useCallback, useMemo} from '@wordpress/element';
import {getBlockSupport} from '@wordpress/blocks';
import {slugify} from '@givewp/form-builder/common';
import normalizeFieldSettings from '@givewp/form-builder/supports/field-settings/normalizeFieldSettings';
import {useFieldNameValidator} from '@givewp/form-builder/hooks';
import {ExternalLink, PanelBody, PanelRow, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import Label from '@givewp/form-builder/blocks/fields/settings/Label';

import {FieldSettings} from './types';
import {FieldSettingsSlot, DisplaySettingsSlot} from './slots';
import {createHigherOrderComponent} from '@wordpress/compose';

const FieldSettingsHOC = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {name, attributes, setAttributes} = props;

        const fieldSettings: FieldSettings = useMemo(() => {
            // @ts-ignore
            const fieldSettings = getBlockSupport(name, 'giveWPFieldSettings') as FieldSettingsSupport;

            return normalizeFieldSettings(fieldSettings);
        }, [name]);

        if (!fieldSettings) {
            return <BlockEdit {...props} />;
        }

        return (
            <FieldSettingsEdit
                attributes={attributes}
                setAttributes={setAttributes}
                fieldSettings={fieldSettings}
                BlockEdit={() => <BlockEdit {...props} />}
            />
        );
    };
}, 'withInspectorControl');

export default FieldSettingsHOC;

function FieldSettingsEdit({attributes, setAttributes, BlockEdit, fieldSettings}) {
    const validateFieldName = useFieldNameValidator();

    const updateFieldName = useCallback(
        (newFieldName) => {
            setAttributes({
                fieldName: slugify(newFieldName),
            });
        },
        [setAttributes]
    );

    const enforceUniqueFieldName = useCallback(() => {
        const [isUnique, suggestedName] = validateFieldName(attributes.fieldName, '');
        if (!isUnique) {
            updateFieldName(suggestedName);
        }
    }, [attributes.fieldName, updateFieldName, validateFieldName]);

    return (
        <>
            <BlockEdit />
            {(fieldSettings.label || fieldSettings.required) && (
                <InspectorControls>
                    <PanelBody title={__('Field Settings', 'give')} initialOpen={true}>
                        {fieldSettings.label && (
                            <PanelRow>
                                <Label
                                    label={attributes.label}
                                    setAttributes={setAttributes}
                                    onBlur={(event) => {
                                        if (!attributes.fieldName) {
                                            updateFieldName(event.target.value);
                                            enforceUniqueFieldName();
                                        }
                                    }}
                                />
                            </PanelRow>
                        )}
                        {fieldSettings.placeholder && (
                            <PanelRow>
                                <TextControl
                                    label={__('Placeholder', 'give')}
                                    value={attributes.placeholder}
                                    onChange={(newPlaceholder) => {
                                        setAttributes({placeholder: newPlaceholder});
                                    }}
                                />
                            </PanelRow>
                        )}
                        {fieldSettings.required && (
                            <PanelRow>
                                <ToggleControl
                                    label={__('Required', 'give')}
                                    checked={attributes.isRequired}
                                    onChange={() => setAttributes({isRequired: !attributes.isRequired})}
                                />
                            </PanelRow>
                        )}
                        {/* @ts-ignore */}
                        <FieldSettingsSlot />
                    </PanelBody>
                </InspectorControls>
            )}
            {(fieldSettings.displayInAdmin || fieldSettings.displayInReceipt) && (
                <InspectorControls>
                    <PanelBody title={__('Display Settings', 'give')} initialOpen={true}>
                        {fieldSettings.displayInAdmin && (
                            <PanelRow>
                                <ToggleControl
                                    label={__('Display in Admin', 'give')}
                                    checked={attributes.displayInAdmin}
                                    onChange={() => setAttributes({displayInAdmin: !attributes.displayInAdmin})}
                                />
                            </PanelRow>
                        )}
                        {fieldSettings.displayInReceipt && (
                            <PanelRow>
                                <ToggleControl
                                    label={__('Display in Receipt', 'give')}
                                    checked={attributes.displayInReceipt}
                                    onChange={() => setAttributes({displayInReceipt: !attributes.displayInReceipt})}
                                />
                            </PanelRow>
                        )}
                        {/* @ts-ignore */}
                        <DisplaySettingsSlot />
                    </PanelBody>
                </InspectorControls>
            )}
            {(fieldSettings.name || fieldSettings.storeAsDonorMeta) && (
                <InspectorAdvancedControls>
                    {fieldSettings.name && (
                        <PanelRow>
                            <TextControl
                                label={__('Field Name', 'give')}
                                value={attributes.fieldName}
                                help={[
                                    __('The programmatic name of the field used by the Fields API.', 'give'),
                                    <ExternalLink
                                        style={{display: 'block', marginTop: '8px'}}
                                        href="https://github.com/impress-org/givewp/tree/develop/src/Framework/FieldsAPI"
                                    >
                                        {__('Learn more about the Fields API', 'give')}
                                    </ExternalLink>,
                                ]}
                                onChange={updateFieldName}
                                onBlur={() => {
                                    enforceRequiredValue();
                                    enforceUniqueFieldName();
                                }}
                            />
                        </PanelRow>
                    )}
                    {fieldSettings.storeAsDonorMeta && (
                        <PanelRow>
                            <ToggleControl
                                label={__('Save to Donor Record', 'give')}
                                checked={attributes.storeAsDonorMeta}
                                onChange={() => setAttributes({storeAsDonorMeta: !attributes.storeAsDonorMeta})}
                                help={__(
                                    "If enabled, the data collected by this field is saved to the Donor record instead of the Donation record. This is useful for data that doesn't normally change between donations, like a phone number or t-shirt size.",
                                    'give'
                                )}
                            />
                        </PanelRow>
                    )}
                </InspectorAdvancedControls>
            )}
        </>
    );
}
