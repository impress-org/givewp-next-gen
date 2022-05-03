import { registerBlockType } from "@wordpress/blocks";
import { Icon } from '@wordpress/icons';
import { __ } from "@wordpress/i18n"
import Edit from './edit.js'
import Defaults from './defaults'

const { attributes } = Defaults

registerBlockType( 'custom-block-editor/section', {
    ...Defaults,
    attributes: {
        ...attributes,
        innerBlocksTemplate: {
            default: [
                //
            ]
        },
    },
    edit: Edit,
} );
