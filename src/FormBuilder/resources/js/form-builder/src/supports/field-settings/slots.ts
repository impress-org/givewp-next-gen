import {createSlotFill} from '@wordpress/components';

/**
 * Slots for used within the field settings inspector controls. This allows plugins and such to add further controls to
 * the inspector sections.
 *
 * @unreleased
 */
const {Slot: FieldSettingsSlot, Fill: FieldSettingsFill} = createSlotFill('GiveWP/FieldSettings/FieldSettingSlot');
const {Slot: DisplaySettingsSlot, Fill: DisplaySettingsFill} = createSlotFill(
    'GiveWP/FieldSettings/DisplaySettingSlot'
);

window.givewp.form.slots = window.givewp.slots || {};
window.givewp.form.slots.FieldSettingsFill = FieldSettingsFill;
window.givewp.form.slots.DisplaySettingsFill = DisplaySettingsFill;

export {FieldSettingsSlot, FieldSettingsFill, DisplaySettingsSlot, DisplaySettingsFill};
