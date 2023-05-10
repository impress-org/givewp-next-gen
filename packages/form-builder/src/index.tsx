import React, {createRoot, render} from '@wordpress/element';
import {BlockSupports, registerBlockType, setCategories} from '@wordpress/blocks';

import App from './App';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import {FieldBlock} from '@givewp/form-builder/types';
import {__} from '@wordpress/i18n';

const supportOverrides: BlockSupports = {
    customClassName: false,
    html: false,
};

setCategories([
    {
        slug: 'input',
        title: __('Input Fields', 'give'),
    },
    {
        slug: 'content',
        title: __('Content & Media', 'give'),
    },
    {
        slug: 'section',
        title: __('Sections', 'give'),
    },
    {
        slug: 'custom',
        title: __('Custom Fields', 'give'),
    },
]);

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

const root = document.getElementById('root');

if (createRoot) {
    createRoot(root).render(<App />);
} else {
    render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        root
    );
}
