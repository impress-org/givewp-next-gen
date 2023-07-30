import {addFilter} from '@wordpress/hooks';
import ConditionalLogicHOC from './ConditionalLogicHOC';
import updateBlockTypes from './updateBlockTypes';
import './styles.scss';

/**
 * Registers the necessary hooks for supports the field settings
 *
 * @unreleased
 */
export default function registerHooks() {
    addFilter('editor.BlockEdit', 'givewp/supports/conditional-logic-hoc', ConditionalLogicHOC);
    addFilter('blocks.registerBlockType', 'givewp/supports/conditional-logic-attributes', updateBlockTypes);
}
