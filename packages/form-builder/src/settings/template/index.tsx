import {PanelBody, PanelRow, SelectControl, ColorPalette, BaseControl} from '@wordpress/components';
import {PanelColorSettings} from '@wordpress/block-editor'
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormState, useFormStateDispatch} from '../../stores/form-state';
import {getWindowData} from '@givewp/form-builder/common';

const {templates} = getWindowData();

const templateOptions = Object.values(templates).map(({id, name}) => ({value: id, label: name}));

const TemplateSettings = () => {
    const {
        settings: {
            templateId,
            primaryColor,
            secondaryColor,
        },
    } = useFormState();
    const dispatch = useFormStateDispatch();

    return (
        <>
            <PanelBody title={__('Donation Form', 'give')} initialOpen={true}>
                <PanelRow>
                    <SelectControl
                        label={__('Form template', 'give')}
                        value={templateId}
                        onChange={(templateId) => dispatch(setFormSettings({templateId}))}
                        options={templateOptions}
                    />
                </PanelRow>
            </PanelBody>
            <PanelColorSettings
                title={__('Colors')}
                colorSettings={[
                    {
                        value: primaryColor,
                        onChange: (primaryColor) => dispatch(setFormSettings({primaryColor})),
                        label: __('Primary Color', 'givewp'),
                        disableCustomColors: false,
                    },
                    {
                        value: secondaryColor,
                        onChange: (secondaryColor) => dispatch(setFormSettings({secondaryColor})),
                        label: __('Secondary Color', 'givewp')
                    },
                ]}
            />
        </>
    );
};

export default TemplateSettings;
