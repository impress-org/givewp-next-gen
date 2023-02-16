import React from 'react';
import {createRoot} from 'react-dom/client';
import {registerBlockType} from '@wordpress/blocks';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import {FieldBlock} from '@givewp/form-builder/types';

sectionBlocks.map(({name, settings}: FieldBlock) =>
    registerBlockType(name, {
        ...settings,
        supports: {
            ...settings.supports,
            customClassName: false,
        },
    })
);

[...fieldBlocks, ...elementBlocks].map(({name, settings}: FieldBlock) =>
    registerBlockType(name, {
        ...settings,
        parent: sectionBlockNames,
        supports: {
            ...settings.supports,
            customClassName: false,
        },
    })
);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
