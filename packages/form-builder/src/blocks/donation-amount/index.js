import { registerBlockType } from "@wordpress/blocks";
import { Icon } from '@wordpress/icons';
import { __ } from "@wordpress/i18n"
import Edit from './edit.js'

registerBlockType( 'custom-block-editor/donation-amount', {

    title: __( 'Donation Amount', 'custom-block-editor' ),

    category: 'layout',

    icon: () => <Icon icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
    } />,

    supports: {
        html: false, // Removes support for an HTML mode.
        multiple: false,
    },

    attributes: {
        title: {
            type: 'string',
            source: 'attribute',
            selector: 'h1',
            default: 'How much would you like to donate today?',
        },
        description: {
            type: 'string',
            source: 'attribute',
            selector: 'p',
            default: 'All donations directly impact our organization and help us further our mission.',
        },
    },

    edit: Edit,

    save: function() {
        return null; // Save as attributes - not rendered HTML.
    }
} );
