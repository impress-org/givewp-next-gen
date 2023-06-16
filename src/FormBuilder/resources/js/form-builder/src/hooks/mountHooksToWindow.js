import {useFieldNameValidator} from './useFieldNameValidator';
import {useSelectedBlocks} from './useSelectedBlocks';

export default function mountHooksToWindow() {
    window.givewp = window.givewp || {};
    window.givewp.hooks = window.givewp.hooks || {};

    window.givewp.hooks = {
        useFieldNameValidator,
        useSelectedBlocks,
    };
}
