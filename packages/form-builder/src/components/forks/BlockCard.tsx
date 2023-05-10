import {BlockIcon} from '@wordpress/block-editor';

/**
 * This is a simplified fork of BlockCard from @wordpress/block-editor.
 *
 * They documented it as an export, but it's not actually exported.
 *
 * @see @wordpress/block-editor/src/components/block-card/index.js
 *
 * @unreleased
 *
 */
export default function BlockCard({icon, title, description}) {
    return (
        <div className={'block-editor-block-card'}>
            <BlockIcon icon={icon} showColors />
            <div className="block-editor-block-card__content">
                <h2 className="block-editor-block-card__title">{title}</h2>
                <span className="block-editor-block-card__description">{description}</span>
            </div>
        </div>
    );
}