import schema from './block.json';
import {registerBlockType} from '@wordpress/blocks';
import Edit from './editor/edit';

/**
 * @since 1.0.0
 */
registerBlockType(schema, {
    edit: Edit,
});
