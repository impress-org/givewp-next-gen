import registerConditionalLogicHooks from './conditional-logic';
import registerFieldSettingsHooks from './field-settings';

export default function registerHooks() {
    registerConditionalLogicHooks();
    registerFieldSettingsHooks();
}
