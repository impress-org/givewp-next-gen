import {PanelBody, PanelRow, SelectControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormSettings, useFormSettingsDispatch} from '../../stores/form-settings';

declare global {
    interface Window {
        storageData?;
    }
}

const TemplateSettings = () => {
    const {template} = useFormSettings();
    const dispatch = useFormSettingsDispatch();
    console.log(window?.storageData?.templates);

    const templateOptions = Object.values(window?.storageData?.templates).map(({id, name}) => {
        return { value: id, label: name}
    })

    return (
        <PanelBody>
            <PanelRow>
                <SelectControl
                    label={__('Form template', 'givewp')}
                    value={template}
                    onChange={(template) => dispatch(setFormSettings({template}))}
                    options={templateOptions}
                />
            </PanelRow>
        </PanelBody>
    );
};

export default TemplateSettings;
