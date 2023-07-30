import {createHigherOrderComponent} from '@wordpress/compose';
import {useSelect} from '@wordpress/data';

import {ConditionalLogicEdit} from '@givewp/form-builder/supports/conditional-logic/ConditionalLogicEdit';
import {flattenBlocks} from '@givewp/form-builder/hooks/useFieldNameValidator';

/**
 * Higher Order Component that adds conditional logic to the inspector controls.
 *
 * @unreleased
 */
const ConditionalLogicHOC = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {attributes, setAttributes, clientId} = props;
        const conditionalLogic = attributes.conditionalLogic;

        // @ts-ignore
        const blocks = useSelect((select) => select('core/block-editor').getBlocks(), []);
        const fieldOptions = [];

        blocks.flatMap(flattenBlocks).forEach((block) => {
            if (block.clientId === clientId || block.name === 'givewp/section') {
                return;
            }

            // TODO: Add support for nested donor name fields.
            if (block.name === 'givewp/donor-name') {
                return;
            }

            if (!block.attributes.label) {
                return;
            }

            return fieldOptions.push({
                label: block.attributes.label,
                value: block.clientId,
            });
        });

        return (
            <>
                <BlockEdit {...props} />
                {attributes.conditionalLogic && fieldOptions.length && (
                    <ConditionalLogicEdit {...{clientId, conditionalLogic, setAttributes, fieldOptions}} />
                )}
            </>
        );
    };
}, 'withInspectorControl');

export default ConditionalLogicHOC;
