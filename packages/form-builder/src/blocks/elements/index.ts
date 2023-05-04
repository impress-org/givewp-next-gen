import paragraph from './paragraph';
import blockRegistrar from '@givewp/form-builder/common/registrars/blocks';

const ElementBlocks = [paragraph];

const blockNames = ElementBlocks.map((block) => block.name);

ElementBlocks.forEach((block) => {
    blockRegistrar.register(block);
});

export {blockNames};
