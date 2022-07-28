import {__} from '@wordpress/i18n';
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, PanelRow, SelectControl} from '@wordpress/components';
import {Fragment, useEffect} from '@wordpress/element';
import useFormOptions from './hooks/useFormOptions';
import Select from './components/Select';
import ConfirmButton from './components/ConfirmButton';
import Logo from './components/Logo';
import {BlockEditProps} from "@wordpress/blocks";

/**
 * @since 1.0.0
 */
export default function Edit({attributes, setAttributes}: BlockEditProps<any>) {
    const {formId} = attributes;
    const {formOptions} = useFormOptions();
    
    useEffect(() => {
        if (!formId) {
            setAttributes({formId: formOptions[0].value})
        }
    }, [JSON.stringify(formOptions)]);

    return (
        <Fragment>
            {/*block controls*/}
            <InspectorControls>
                <PanelBody title={__('Form Settings', 'give')} initialOpen={true}>
                    <PanelRow>
                        <SelectControl
                            label={__('Choose a donation form', 'give')}
                            value={formId}
                            options={formOptions}
                            onChange={(newFormId) => {
                                setAttributes({formId: Number(newFormId)});
                            }}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>

            {/*block preview*/}
            <div {...useBlockProps()}>
                <div className="givewp-form-block--container">
                    <Logo/>

                    <Select
                        id="formId"
                        label={__('Choose a donation form', 'give')}
                        options={formOptions}
                        onChange={(event) => {
                            setAttributes({formId: (event.target as HTMLSelectElement).value});
                        }}
                    />

                    <ConfirmButton/>
                </div>
            </div>
        </Fragment>
    );
}
