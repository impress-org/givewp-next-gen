import {addFilter} from '@wordpress/hooks';

import FieldSettingsHOC from './FieldSettingsHOC';
import updateBlockTypes from './updateBlockTypes';
import {AdvancedSettingsFill, DisplaySettingsFill, FieldSettingsFill} from './slots';

/**
 * Registers the necessary hooks for supports the field settings
 *
 * @unreleased
 */
export default function registerHooks() {
    addFilter('editor.BlockEdit', 'givewp/supports/field-settings-hoc', FieldSettingsHOC);
    addFilter('blocks.registerBlockType', 'givewp/supports/field-settings-attributes', updateBlockTypes);

    // Mounts the field settings inspector slots so other plugins can extend the inspector controls
    window.givewp.form.slots = window.givewp.form.slots || {};
    window.givewp.form.slots.FieldSettingsFill = FieldSettingsFill;
    window.givewp.form.slots.DisplaySettingsFill = DisplaySettingsFill;
    window.givewp.form.slots.AdvancedSettingsFill = AdvancedSettingsFill;
}
