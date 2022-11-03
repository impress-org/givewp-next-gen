import {PanelBody, PanelRow, SelectControl, TextControl} from '@wordpress/components';
import {BlockCard} from '@wordpress/block-editor'
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormSettings, useFormSettingsDispatch} from '../../stores/form-settings/index.tsx';

const TemplateSettings = () => {
    const {template} = useFormSettings();
    const dispatch = useFormSettingsDispatch();

    const templateOptions = [
        {value: '', label: __('No Template', 'givewp')},
        {value: 'classic', label: __('Classic', 'givewp')},
    ]

    const selectedTemplate = templateOptions.filter((option) => option.value === template).pop()

    return (
        <PanelBody>
            <PanelRow>
                { template
                    ? <div>{selectedTemplate.label}</div> // @todo Update to match the design
                    : <span className={'block-editor-block-inspector__no-blocks'}>{__('No template selected.', 'givewp')}</span>
                }
            </PanelRow>
            <PanelRow>
                <SelectControl
                    labelPosition={'left'}
                    label={__('Form Title')}
                    selected={template}
                    onChange={(template) => dispatch(setFormSettings({template}))}
                    options={templateOptions}
                />
            </PanelRow>
        </PanelBody>
    );
};

export default TemplateSettings;
