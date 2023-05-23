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

const ExtensionBlocks: FieldBlock[] = window?.givewp?.form?.blocks || [];

export default ExtensionBlocks;
