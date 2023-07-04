import {createSlotFill} from '@wordpress/components';

const {Slot: FieldSettingsSlot, Fill: FieldSettingsFill} = createSlotFill('GiveWP/FieldSettings/FieldSettingSlot');
const {Slot: DisplaySettingsSlot, Fill: DisplaySettingsFill} = createSlotFill(
    'GiveWP/FieldSettings/DisplaySettingSlot'
);

window.givewp.slots = window.givewp.slots || {};
window.givewp.slots.FieldSettingsFill = FieldSettingsFill;
window.givewp.slots.DisplaySettingsFill = DisplaySettingsFill;

export {FieldSettingsSlot, FieldSettingsFill, DisplaySettingsSlot, DisplaySettingsFill};
