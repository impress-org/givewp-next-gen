import {__} from '@wordpress/i18n';
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, PanelRow, SelectControl} from '@wordpress/components';
import {Fragment, useEffect} from '@wordpress/element';
import useFormOptions from './hooks/useFormOptions';
import ConfirmButton from './components/ConfirmButton';
import Logo from './components/Logo';
import {BlockEditProps} from "@wordpress/blocks";
import ReactSelect from 'react-select';


/**
 * @since 1.0.0
 */
export default function Edit({attributes, setAttributes}: BlockEditProps<any>) {
    const {formId} = attributes;
    const {formOptions, isResolving} = useFormOptions();

    useEffect(() => {
        if (!formId && formOptions) {
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
                                setAttributes({formId: newFormId});
                            }}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>

            {/*block preview*/}
            <div {...useBlockProps()}>
                <div className="givewp-form-block--container">
                    <Logo/>

                    <div className="givewp-form-block__select--container">
                        <label
                            htmlFor="formId"
                            className="givewp-form-block__select--label">{__('Choose a donation form', 'give')}
                        </label>

                        <ReactSelect
                            classNamePrefix="givewp-form-block__select"
                            name="formId"
                            inputId="formId"
                            value={!isResolving && formOptions?.find(({value}) => value === formId)}
                            placeholder={isResolving ? __('Loading Donation Forms...', 'give') : __('Select...', 'give')}
                            onChange={(option) => {
                                setAttributes({formId: option.value});
                            }}
                            noOptionsMessage={() =>
                                <p>{__('No forms were found using the GiveWP form builder.', 'give')}</p>}
                            options={formOptions}
                            loadingMessage={() => <>{__('Loading Donation Forms...', 'give')}</>}
                            isLoading={isResolving}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: '#27ae60',
                                },
                            })}
                        />

                    </div>

                    <ConfirmButton/>
                </div>
            </div>
        </Fragment>
    );
}
