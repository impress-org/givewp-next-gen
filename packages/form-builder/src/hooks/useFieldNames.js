import {useSelect} from '@wordpress/data';

export const getFieldNameFrequency = (fieldName, fieldNames) => {
    return fieldNames.filter((name) => name === fieldName).length;
};

export const getFieldNameSuggestion = (name, names) => {
    const [ prefix ] = name.split(/^(.*)-([0-9]*)$/g).filter(Boolean)
    const similarFieldNames = names.filter(fieldName => fieldName.startsWith(prefix));
    const increments = similarFieldNames.flatMap(fieldName => fieldName.split(/^.*-([0-9]*)$/g).filter(Number) ) || [ 0 ]
    const nextIncrement = increments.length ? Math.max(...increments) + 1 : 1
    return `${prefix}-${nextIncrement}`;
}

export const flattenBlocks = (block) => [block, ...block.innerBlocks.flatMap(flattenBlocks)]

/**
 * A hook for validating uniqueness of the 'fieldName' attribute.
 *
 * @return {function(*): [boolean,string]}
 */
const useFieldNames = () => {
    const blocks = useSelect((select) => select('core/block-editor').getBlocks(), []);

    const fieldNames = blocks.flatMap(flattenBlocks)
                             .map(block => block.attributes.fieldName)
                             .filter(name => name)

    return (n) => [
        /**
         * We are checking for uniqueness after the field name is updated.
         * Therefor the field name will be in the list at least once.
         */
        1 >= getFieldNameFrequency(n, fieldNames ?? []),
        getFieldNameSuggestion(n, fieldNames ?? [])
    ]
};

export default useFieldNames;
