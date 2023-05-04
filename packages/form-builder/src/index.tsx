import React from 'react';
import {createRoot} from 'react-dom/client';
import {BlockSupports, registerBlockType} from '@wordpress/blocks';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';
import {FieldBlock} from '@givewp/form-builder/types';

import './blocks/fields';
import './blocks/elements';

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

blockRegistrar.getAll().map(({name, settings}: FieldBlock) =>
    registerBlockType(name, {
        ...settings,
        parent: sectionBlockNames,
        supports: {
            ...settings.supports,
            ...supportOverrides,
        },
    })
);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
