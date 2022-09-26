import {useSelect} from "@wordpress/data";

export const isFieldNameUnique = (name, names) => {
    return -1 === names.indexOf(name)
}

export const getFieldNameSuggestion = (name, names) => {
    console.log( name )
    const [ prefix ] = name.split(/^(.*)-([0-9])$/g).filter(Boolean)
    const similarFieldNames = names.filter(fieldName => fieldName.startsWith(prefix));
    const increments = similarFieldNames.flatMap(fieldName => fieldName.split(/^.*-([0-9])$/g).filter(Number) ) || [ 0 ]
    const nextIncrement = Math.max(increments) + 1
    return `${prefix}-${nextIncrement}`;
}

export const flattenBlocks = (block) => [block, ...block.innerBlocks.flatMap(flattenBlocks)]

const useFieldNames = () => {
    const blocks = useSelect((select) => select('core/block-editor').getBlocks());

    const fieldNames = blocks.flatMap(flattenBlocks)
                             .map(block => block.attributes.fieldName)
                             .filter(name => name)

    return (n) => [
        isFieldNameUnique(n, fieldNames),
        getFieldNameSuggestion(n, fieldNames)
    ]
};

export default useFieldNames;
