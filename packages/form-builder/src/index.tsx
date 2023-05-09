import React from 'react';
import {createRoot} from 'react-dom/client';
import {BlockSupports, registerBlockType} from '@wordpress/blocks';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';
import {FieldBlock} from '@givewp/form-builder/types';

import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import extensionBlocks from './blocks/extensions';

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

[...fieldBlocks, ...elementBlocks, ...extensionBlocks].map((block: FieldBlock) => {
    const {name, settings} = block;

    blockRegistrar.register(block);

    registerBlockType(name, {
        ...settings,
        parent: sectionBlockNames,
        supports: {
            ...settings.supports,
            ...supportOverrides,
        },
    });
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
