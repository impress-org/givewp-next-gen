import {InspectorAdvancedControls, InspectorControls} from '@wordpress/block-editor';
import {useCallback, useMemo} from '@wordpress/element';
import {getBlockSupport} from '@wordpress/blocks';
import {slugify} from '@givewp/form-builder/common';
import normalizeFieldSettings from '@givewp/form-builder/supports/field-settings/normalizeFieldSettings';
import {useFieldNameValidator} from '@givewp/form-builder/hooks';
import {ExternalLink, PanelBody, PanelRow, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import Label from '@givewp/form-builder/blocks/fields/settings/Label';

import {FieldSettings} from './types';
import {AdvancedSettingsSlot, DisplaySettingsSlot, FieldSettingsSlot} from './slots';
import {createHigherOrderComponent} from '@wordpress/compose';
import {GiveWPSupports} from '@givewp/form-builder/supports/types';
import {useState} from 'react';

/**
 * Higher Order Component that adds field settings to the inspector controls.
 *
 * @unreleased
 */
const FieldSettingsHOC = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {name, attributes, setAttributes} = props;

        const fieldSettings: FieldSettings = useMemo(() => {
            // @ts-ignore
            const giveSupports = getBlockSupport(name, 'givewp') as GiveWPSupports;

            return normalizeFieldSettings(giveSupports?.fieldSettings);
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

/**
 * Renders the field settings inspector controls.
 *
 * @unreleased
 */
function FieldSettingsEdit({attributes, setAttributes, BlockEdit, fieldSettings}) {
    const validateFieldName = useFieldNameValidator();
    const [fieldNameSet, setFieldNameSet] = useState(attributes.hasOwnProperty('fieldName'));

    const updateFieldName = useCallback(
        (newFieldName = null, bumpUniqueness = false) => {
            let slugifiedName = newFieldName ? slugify(newFieldName) : null;

            if (!slugifiedName) {
                slugifiedName = slugify(attributes.label);
            }

            const [isUnique, suggestedName] = validateFieldName(slugifiedName, bumpUniqueness);

            if (!isUnique) {
                slugifiedName = suggestedName;
            }

            setAttributes({
                fieldName: slugifiedName,
            });
        },
        [setAttributes, attributes.label, validateFieldName]
    );

    const handleLabelBlur = useCallback(
        (event) => {
            if (!fieldNameSet) {
                updateFieldName(event.target.value);
                setFieldNameSet(true);
            }
        },
        [fieldNameSet, updateFieldName]
    );

    const enforceFieldName = useCallback(() => {
        if (!attributes.fieldName) {
            updateFieldName();
        } else {
            updateFieldName(attributes.fieldName, true);
        }
    }, [attributes.fieldName, updateFieldName]);

    if (!attributes.hasOwnProperty('fieldName')) {
        updateFieldName();
    }

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
                                    onBlur={handleLabelBlur}
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
                        {fieldSettings.description && (
                            <PanelRow>
                                <TextControl
                                    label={__('Description', 'give')}
                                    value={attributes.description}
                                    onChange={(newDescription) => {
                                        setAttributes({description: newDescription});
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
                    <AdvancedSettingsSlot />

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
                                onChange={(newName) => setAttributes({fieldName: newName})}
                                onBlur={enforceFieldName}
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
