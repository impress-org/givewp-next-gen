import blocksJson from '@givewp/form-builder/blocks.json';

const getDefaultBlockAttributes = (blockName: string) => {
    // @ts-ignore
    return blocksJson.flatMap(({innerBlocks}) => innerBlocks).find(({name}) => name === blockName)?.attributes;
};

export default getDefaultBlockAttributes;