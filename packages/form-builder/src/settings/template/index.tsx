import {PanelBody, PanelRow, SelectControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormSettings, useFormSettingsDispatch} from '../../stores/form-settings';
import {getWindowData} from '@givewp/form-builder/common';

const {templates} = getWindowData();

const templateOptions = Object.values(templates).map(({id, name}) => ({value: id, label: name}));

const TemplateSettings = () => {
    const {templateId} = useFormSettings();
    const dispatch = useFormSettingsDispatch();

    return (
        <PanelBody>
            <PanelRow>
                <SelectControl
                    label={__('Form template', 'givewp')}
                    value={templateId}
                    onChange={(templateId) => dispatch(setFormSettings({templateId}))}
                    options={templateOptions}
                />
            </PanelRow>
        </PanelBody>
    );
};

export default TemplateSettings;
