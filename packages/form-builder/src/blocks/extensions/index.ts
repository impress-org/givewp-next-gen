import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';
import {FieldBlock} from '@givewp/form-builder/types';

declare global {
    interface Window {
        givewp?: {
            form?: {
                blocks?: FieldBlock[];
            };
        };
    }
}

const ExtensionBlocks = window?.givewp?.form?.blocks || [];

ExtensionBlocks.forEach((block) => {
    blockRegistrar.register(block);
});
