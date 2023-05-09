import React from 'react';
import {createRoot} from 'react-dom/client';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import extensionBlocks from './blocks/extensions';
import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';

import App from './App';

blockRegistrar.register(sectionBlocks);
blockRegistrar.register(fieldBlocks, sectionBlockNames);
blockRegistrar.register(elementBlocks, sectionBlockNames);
blockRegistrar.register(extensionBlocks, sectionBlockNames);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
