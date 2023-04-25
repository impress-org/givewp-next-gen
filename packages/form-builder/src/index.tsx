import React from 'react';
import {createRoot} from 'react-dom/client';
import {BlockSupports, registerBlockType} from '@wordpress/blocks';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import {FieldBlock} from '@givewp/form-builder/types';
import {applyFilters} from '@wordpress/hooks';

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

const registeredBlocks = applyFilters('givewp.formBuilder.registeredBlocks', [
    ...fieldBlocks,
    ...elementBlocks,
]) as FieldBlock[];

registeredBlocks.map(({name, settings}: FieldBlock) =>
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
        <App/>
    </React.StrictMode>
);
