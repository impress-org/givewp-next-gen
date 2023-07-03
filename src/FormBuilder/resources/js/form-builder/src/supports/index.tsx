import {addFilter} from '@wordpress/hooks';
import {createHigherOrderComponent} from '@wordpress/compose';
import {getBlockSupport} from '@wordpress/blocks';
import {InspectorControls, InspectorAdvancedControls} from '@wordpress/block-editor';
import {ExternalLink, PanelBody, PanelRow, TextControl, ToggleControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {useFieldNameValidator} from '@givewp/form-builder/hooks';
import {useCallback, useMemo} from '@wordpress/element';
import {slugify} from '@givewp/form-builder/common';
import Label from '@givewp/form-builder/blocks/fields/settings/Label';

type FieldSettings = {
    label: boolean;
    name: boolean;
    placeholder: boolean;
    required: boolean;
    storeAsDonorMeta: boolean;
    displayInAdmin: boolean;
    displayInReceipt: boolean;
};

type FieldSettingsSupport = FieldSettings | true;

type FieldAttributes = {
    [key: string]: {
        type: string;
        default: string | boolean;
        required?: boolean;
    };
};

function getFieldSettings(settings: FieldSettingsSupport | false): FieldSettings | null {
    if (settings === undefined || settings === false) {
        return null;
    }

    const getSupportSetting = (setting: keyof FieldSettings, defaultValue: boolean) => {
        return settings === true || settings[setting] === undefined ? defaultValue : settings[setting];
    };

    return {
        label: getSupportSetting('label', true),
        name: getSupportSetting('name', true),
        placeholder: getSupportSetting('placeholder', false),
        required: getSupportSetting('required', true),
        storeAsDonorMeta: getSupportSetting('storeAsDonorMeta', true),
        displayInAdmin: getSupportSetting('displayInAdmin', true),
        displayInReceipt: getSupportSetting('displayInReceipt', true),
    };
}

export default function registerHooks() {
    addFilter('editor.BlockEdit', 'givewp/fields/add-supports', addInspectorControl);

    addFilter('blocks.registerBlockType', 'givewp/fields/add-attributes-for-supports', (settings, name) => {
        const fieldSettings = getFieldSettings(settings.supports.giveWPFieldSettings);

        if (fieldSettings === null) {
            return settings;
        }

        let fieldAttributes: FieldAttributes = {};

        if (fieldSettings.label) {
            fieldAttributes.label = {
                type: 'string',
                default: __('Text Field', 'give'),
            };
        }

        if (fieldSettings.name) {
            fieldAttributes.fieldName = {
                type: 'string',
                default: '',
            };
        }

        if (fieldSettings.required) {
            fieldAttributes.isRequired = {
                type: 'boolean',
                default: false,
            };
        }

        if (fieldSettings.placeholder) {
            fieldAttributes.placeholder = {
                type: 'string',
                default: '',
            };
        }

        if (fieldSettings.storeAsDonorMeta) {
            fieldAttributes.storeAsDonorMeta = {
                type: 'boolean',
                default: false,
            };
        }

        if (fieldSettings.displayInAdmin) {
            fieldAttributes.displayInAdmin = {
                type: 'boolean',
                default: true,
            };
        }

        if (fieldSettings.displayInReceipt) {
            fieldAttributes.displayInReceipt = {
                type: 'boolean',
                default: true,
            };
        }

        settings.attributes = {
            ...settings.attributes,
            ...fieldAttributes,
        };

        return settings;
    });
}

const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {name, attributes, setAttributes} = props;
        const validateFieldName = useFieldNameValidator();

        const fieldSettings: FieldSettings = useMemo(() => {
            // @ts-ignore
            const fieldSettings = getBlockSupport(name, 'giveWPFieldSettings') as FieldSettingsSupport;

            return getFieldSettings(fieldSettings);
        }, [name]);

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

        const enforceRequiredValue = useCallback(() => {
            if (!attributes.fieldName) {
                updateFieldName(attributes.label);
            }
        }, [attributes.fieldName, updateFieldName, attributes.label]);

        if (!fieldSettings) {
            return <BlockEdit {...props} />;
        }

        return (
            <>
                <BlockEdit {...props} />
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
    };
}, 'withInspectorControl');
