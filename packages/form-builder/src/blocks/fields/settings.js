import {InspectorControls} from "@wordpress/block-editor";
import {PanelBody, PanelRow, TextControl, ToggleControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {noop} from "lodash";

const Edit = function (props) {

    const {
        attributes: {label, placeholder, isRequired, options},
        setAttributes,
        onLabelTextControlBlur = noop
    } = props;

    const requiredClass = isRequired ? "give-is-required" : "";

    return (
        <>
            <div>
                {'undefined' === typeof options
                    ? <TextControl label={label} placeholder={placeholder} required={isRequired}
                                   className={requiredClass} />
                    : <select>{options.map((option) => <option key={option.value}
                                                               value={option.value}>{option.label}</option>)}</select>
                }
            </div>

            <InspectorControls>
                <PanelBody title={__('Field Settings', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={'Label'}
                            value={label}
                            onChange={(val) => setAttributes({label: val})}
                            onBlur={onLabelTextControlBlur}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={'Placeholder'}
                            value={placeholder}
                            onChange={(val) => setAttributes({placeholder: val})}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={'Required'}
                            checked={isRequired}
                            onChange={() => setAttributes({isRequired: !isRequired})}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        </>
    );
}

const settings = {

    title: __('Field', 'custom-block-editor'),

    supports: {
        html: false, // Removes support for an HTML mode.
        multiple: true,
    },

    attributes: {
        fieldName: {
            type: 'string',
            source: 'attribute',
        },
        label: {
            type: 'string',
            source: 'attribute',
            default: __('Text Field', 'give'),
        },
        placeholder: {
            type: 'string',
            source: 'attribute',
            default: '',
        },
        isRequired: {
            type: 'boolean',
            source: 'attribute',
            default: false,
        },
        options: {
            type: 'array',
        },
    },

    edit: Edit,

    save: function () {
        return null; // Save as attributes - not rendered HTML.
    },
};

export default settings;
