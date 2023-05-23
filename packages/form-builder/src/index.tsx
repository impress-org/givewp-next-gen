import {createRoot, render, StrictMode} from '@wordpress/element';
import {BlockSupports, getCategories, registerBlockType, setCategories} from '@wordpress/blocks';
import {__} from '@wordpress/i18n';

import sectionBlocks, {sectionBlockNames} from './blocks/section';
import fieldBlocks from './blocks/fields';
import elementBlocks from './blocks/elements';
import extensionBlocks from './blocks/extensions';
import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';

import App from './App';

setCategories([
    ...getCategories(),
    {
        slug: 'input',
        title: __('Input Fields', 'give'),
    },
    {
        slug: 'content',
        title: __('Content & Media', 'give'),
    },
    {
        // layout seems to be a core category slug
        slug: 'section',
        title: __('Layout', 'give'),
    },
    {
        slug: 'custom',
        title: __('Custom Fields', 'give'),
    },
    {
        slug: 'addons',
        title: __('Add-ons', 'give'),
    },
]);

blockRegistrar.register(sectionBlocks);
blockRegistrar.register(fieldBlocks, sectionBlockNames);
blockRegistrar.register(elementBlocks, sectionBlockNames);
blockRegistrar.register(extensionBlocks, sectionBlockNames);

const root = document.getElementById('root');

const RenderApp = () => (
    <StrictMode>
        <App />
    </StrictMode>
);

if (createRoot) {
    createRoot(root).render(<RenderApp />);
} else {
    render(<RenderApp />, root);
}
