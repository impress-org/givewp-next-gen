import {__} from "@wordpress/i18n";

import {
    RichText,
    InspectorControls,
    InnerBlocks,
} from "@wordpress/block-editor";

import {
    PanelBody,
    PanelRow,
    TextControl,
    TextareaControl,
} from "@wordpress/components";

export default function Edit( props ) {

    const {
        attributes: { title, description },
        setAttributes,
    } = props;

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px',  outline: '3px solid lightgray', padding: '0 20px' }}>
                <header>
                    <RichText
                        tagName="h2"
                        value={ title }
                        onChange={ ( val ) => setAttributes( { title: val } ) }
                        style={{ borderBottom: '0.0625rem solid #ddd' }}
                    />
                    <RichText
                        tagName="p"
                        value={ description }
                        onChange={ ( val ) => setAttributes( { description: val } ) }
                    />
                </header>

                <InnerBlocks
                    template={[
                        [ 'custom-block-editor/name-field-group', { lock: { remove: true } }  ],
                        [ 'custom-block-editor/email-field' ],
                    ]}
                    renderAppender={ !! props.isSelected && InnerBlocks.ButtonBlockAppender}
                />

            </div>

            <InspectorControls>
                <PanelBody title={ __( 'Attributes', 'give' ) } initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={'Title'}
                            value={ title }
                            onChange={ ( val ) => setAttributes( { title: val } ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextareaControl
                            label={'Description'}
                            value={ description }
                            onChange={ ( val ) => setAttributes( { description: val } ) }
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        </>
    )
}
