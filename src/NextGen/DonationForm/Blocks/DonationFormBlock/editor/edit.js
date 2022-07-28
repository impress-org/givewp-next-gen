import {__} from '@wordpress/i18n';
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, PanelRow, SelectControl} from '@wordpress/components';
import {Fragment, useEffect} from '@wordpress/element';
import useFormOptions from './hooks/useFormOptions';
import logo from './images/givewp-logo.svg';
import usePostState from './hooks/usePostState';
import Select from './components/Select';

const savePost = () => wp.data.dispatch('core/editor').savePost();

/**
 * @since 1.0.0
 * @param attributes
 * @param setAttributes
 * @returns {JSX.Element}
 * @constructor
 */
export default function Edit({attributes, setAttributes}) {
    const {formId} = attributes;
    const {formOptions} = useFormOptions();
    const {isSaving, isDisabled} = usePostState();

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
                <div
                    className="givewp-form-block--container">
                    <div className="givewp-form-block__logo--container" style={{
                        textAlign: 'center',
                    }}>
                        <img className="givewp-form-block__logo" src={logo} alt="givewp-logo"/>
                    </div>

                    <Select
                        id="formId"
                        label={__('Choose a donation form', 'give')}
                        options={formOptions}
                        onChange={(event) => {
                            setAttributes({formId: event.target.value});
                        }}
                    />

                    <div className="givewp-form-block__submit-button--container">
                        <button
                            className="givewp-form-block__submit-button"
                            type="button"
                            disabled={isSaving || isDisabled}
                            onClick={savePost}>
                            {__('Confirm', 'give')}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
