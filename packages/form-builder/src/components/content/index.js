import React, { useContext } from 'react';
import {BlockList, BlockTools, ObserveTyping, WritingFlow, ButtonBlockAppender, RichText } from "@wordpress/block-editor";
import { FormSettingsContext } from '../../context/formSettings'

const Component = () => {

    const [formSettings, setFormSettings] = useContext(FormSettingsContext)

    return (
        <BlockTools>
            <WritingFlow>
                <RichText
                    tagName="h1"
                    value={ formSettings.formTitle }
                    onChange={ ( formTitle ) => {
                        setFormSettings({
                            ...formSettings,
                            formTitle: formTitle,
                        })
                    } }
                    style={{ margin: '40px' }}
                />
                <ObserveTyping>
                    <BlockList
                        renderAppender={ButtonBlockAppender}
                    />
                </ObserveTyping>
            </WritingFlow>
        </BlockTools>
    )
}

export default Component
