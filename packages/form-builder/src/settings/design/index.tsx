import {PanelBody, PanelRow, SelectControl, TextareaControl, TextControl, ToggleControl} from '@wordpress/components';
import {PanelColorSettings, SETTINGS_DEFAULTS} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormState, useFormStateDispatch} from '../../stores/form-state';
import {getWindowData} from '@givewp/form-builder/common';
import debounce from 'lodash.debounce';
import BlockCard from '@givewp/form-builder/components/forks/BlockCard';
import {brush} from '@wordpress/icons';

const {formDesigns} = getWindowData();

const designOptions = Object.values(formDesigns).map(({id, name}) => ({value: id, label: name}));

const FormDesignSettings = () => {
    const {
        settings: {designId, showHeading, heading, showDescription, description, primaryColor, secondaryColor},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    return (
        <>
            <BlockCard
                icon={brush}
                title="Form Design"
                description={__('These settings affect the appearance of your form.', 'give')}
            />
            <PanelBody title={__('Design Settings', 'give')} initialOpen={true}>
                <PanelRow>
                    <SelectControl
                        label={__('Form design', 'give')}
                        value={designId}
                        onChange={(designId) => dispatch(setFormSettings({designId}))}
                        options={designOptions}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={__('Heading', 'give')}
                        value={heading}
                        onChange={(heading) => dispatch(setFormSettings({heading}))}
                    />
                </PanelRow>
                <PanelRow>
                    <TextareaControl
                        label={__('Description', 'give')}
                        value={description}
                        onChange={(description) => dispatch(setFormSettings({description}))}
                    />
                </PanelRow>
                <PanelRow>
                    <ToggleControl
                        label={__('Show Heading', 'give')}
                        checked={showHeading}
                        onChange={() => dispatch(setFormSettings({showHeading: !showHeading}))}
                    />
                </PanelRow>
                <PanelRow>
                    <ToggleControl
                        label={__('Show Description', 'give')}
                        checked={showDescription}
                        onChange={() => dispatch(setFormSettings({showDescription: !showDescription}))}
                    />
                </PanelRow>
                <PanelColorSettings
                    title={__('Colors', 'give')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: primaryColor,
                            onChange: debounce((primaryColor) => dispatch(setFormSettings({primaryColor})), 100),
                            label: __('Primary Color', 'give'),
                            disableCustomColors: false,
                            colors: SETTINGS_DEFAULTS.colors,
                        },
                        {
                            value: secondaryColor,
                            onChange: debounce((secondaryColor) => dispatch(setFormSettings({secondaryColor})), 100),
                            label: __('Secondary Color', 'give'),
                            disableCustomColors: false,
                            colors: SETTINGS_DEFAULTS.colors,
                        },
                    ]}
                />
            </PanelBody>
        </>
    );
};

export default FormDesignSettings;
