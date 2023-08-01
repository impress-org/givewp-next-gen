import {BaseControl, PanelBody, PanelRow, ToggleControl} from '@wordpress/components';
import {useState} from '@wordpress/element';
import {__} from '@wordpress/i18n';
import OptionsHeader from './OptionsHeader';
import OptionsList from './OptionsList';

import {OptionsPanelProps} from './types';

export default function Options({multiple, options, setOptions}: OptionsPanelProps) {
    const [showValues, setShowValues] = useState<boolean>(false);

    const handleAddOption = (): void => {
        setOptions([...options, {label: '', value: '', checked: false}]);
    };

    console.log('options: ', options);

    return (
        <PanelBody title={__('[NEW] Donation Levels', 'give')}>
            <PanelRow>
                <ToggleControl
                    label={__('Show values', 'give')}
                    checked={showValues}
                    onChange={() => setShowValues(!showValues)}
                />
            </PanelRow>
            <PanelRow>
                <BaseControl id={'give-form-field-manager-options'}>
                    <OptionsHeader handleAddOption={handleAddOption} />
                    <OptionsList
                        {...{
                            options,
                            showValues,
                            multiple,
                            setOptions,
                        }}
                    />
                </BaseControl>
            </PanelRow>
        </PanelBody>
    );
}
