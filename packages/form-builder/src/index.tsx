import {render} from '@wordpress/element';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import {FieldBlock} from '@givewp/form-builder/types';
import {BlockInstance, BlockSupports, registerBlockType} from '@wordpress/blocks';
import {FormStateProvider} from '@givewp/form-builder/stores/form-state';
import {Storage} from './common';
import defaultBlocks from './blocks.json';

const supportOverrides: BlockSupports = {
    customClassName: false,
    html: false,
};

sectionBlocks.map(({name, settings}: FieldBlock) =>
    registerBlockType(name, {
        ...settings,
        supports: {
            ...settings.supports,
            ...supportOverrides,
        },
    })
);

[...fieldBlocks, ...elementBlocks].map(({name, settings}: FieldBlock) =>
    registerBlockType(name, {
        ...settings,
        parent: sectionBlockNames,
        supports: {
            ...settings.supports,
            ...supportOverrides,
        },
    })
);

const {blocks: initialBlocks, formSettings: initialFormSettings} = Storage.load();

const initialState = {
    blocks: initialBlocks || (defaultBlocks as BlockInstance[]),
    settings: {
        ...initialFormSettings,
    },
};

if (initialBlocks instanceof Error) {
    alert('Unable to load initial blocks.');
    console.error(initialBlocks);
}

const container = document.getElementById('root');
//const root = createRoot(container!);

render(
    <FormStateProvider initialState={initialState}>
        <App />
    </FormStateProvider>,
    container
);
