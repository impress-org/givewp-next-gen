import {__} from '@wordpress/i18n';

import {InnerBlocks, InspectorControls, RichText} from '@wordpress/block-editor';

import {PanelBody, PanelRow, TextareaControl, TextControl} from '@wordpress/components';

import {useSelect} from '@wordpress/data';

import styles from './style.module.scss';

export default function Edit(props) {
    const {
        attributes: {title, description},
        setAttributes,
    } = props;

    const isParentOfSelectedBlock = useSelect((select) =>
        select('core/block-editor').hasSelectedInnerBlock(props.clientId, true)
    );
    const isSelectedOrIsInnerBlockSelected = props.isSelected || isParentOfSelectedBlock;
    const borderColor = isSelectedOrIsInnerBlockSelected ? '#66bb6a' : 'lightgray';

    return (
        <>
            <div className={styles.section}>
                <header>
                    <RichText tagName="h2" value={title} onChange={(val) => setAttributes({title: val})} />
                    <RichText tagName="p" value={description} onChange={(val) => setAttributes({description: val})} />
                </header>

                <InnerBlocks
                    allowedBlocks={
                        [] /* This prevents nested sections. Empty array is overwritten by child blocks specifying a parent. */
                    }
                    template={props.attributes.innerBlocksTemplate}
                    renderAppender={!!isSelectedOrIsInnerBlockSelected && InnerBlocks.ButtonBlockAppender}
                />
            </div>

            <InspectorControls>
                <PanelBody title={__('Attributes', 'give')} initialOpen={true}>
                    <PanelRow>
                        <TextControl label={'Title'} value={title} onChange={(val) => setAttributes({title: val})} />
                    </PanelRow>
                    <PanelRow>
                        <TextareaControl
                            label={'Description'}
                            value={description}
                            onChange={(val) => setAttributes({description: val})}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        </>
    );
}
