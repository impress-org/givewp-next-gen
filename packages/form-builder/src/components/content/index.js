import React, { useContext } from 'react';
import {BlockList, BlockTools, ObserveTyping, WritingFlow, ButtonBlockAppender, RichText } from "@wordpress/block-editor";
import { FormTitleContext } from '../../context/formTitle'
import { FormSettingsContext } from "../../context/formSettings";

const Component = () => {

    // const [formTitle, setFormTitle] = useContext(FormTitleContext)

    const [formSettings, setFormSettings] = useContext(FormSettingsContext)
    const { formTitle } = formSettings
    const setFormSetting = ( newSettings ) => {
        setFormSettings({
            ...formSettings,
            ...newSettings,
        })
    }

    return (
        <BlockTools>
            <WritingFlow>
                <RichText
                    tagName="h1"
                    value={ formTitle }
                    onChange={ ( formTitle ) => setFormSetting( { formTitle: formTitle }) }
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
