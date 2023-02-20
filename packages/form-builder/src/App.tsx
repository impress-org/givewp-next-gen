import IsolatedBlockEditor, {
    ActionArea,
    DocumentSection,
    EditorHeadingSlot,
    EditorLoaded,
    FooterSlot,
    IsoSettings,
    ToolbarSlot,
} from '@automattic/isolated-block-editor';

import formBuilderBlockNames from '@givewp/form-builder/blocks/formBuilderBlockNames';
import Feedback from '@givewp/form-builder/feedback';
import {
    setFormBlocks,
    setFormSettings,
    useFormState,
    useFormStateDispatch,
} from '@givewp/form-builder/stores/form-state';
import {useDispatch} from '@wordpress/data';
import React, {useState} from 'react';
import {Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {Storage} from '@givewp/form-builder/common';
import {FormSettings} from '@givewp/form-builder/types';
import {setIsDirty} from '@givewp/form-builder/stores/form-state/reducer';
import './App.scss';
import {FormTab} from '@givewp/form-builder/components/sidebar/Primary';

const isoSettings: IsoSettings = {
    defaultPreferences: {
        fixedToolbar: false,
    },
    blocks: {
        allowBlocks: formBuilderBlockNames,
        disallowBlocks: [],
    },
    sidebar: {
        inserter: true,
        inspector: true,
    },
    toolbar: {
        inserter: true,
        inspector: true,
        toc: false,
        undo: true,
        navigation: true,
        documentInspector: true,
        selectorTool: true,
    },
    moreMenu: {
        editor: true,
        topToolbar: true,
        fullscreen: false,
        preview: false,
    },
};

function App() {
    const {blocks, settings: formSettings, isDirty} = useFormState();
    const dispatch = useFormStateDispatch();
    const {createSuccessNotice} = useDispatch('core/notices');
    const [isSaving, setSaving] = useState(false);
    const {formTitle} = formSettings;

    const dispatchFormBlocks = (blocks) => {
        dispatch(setFormBlocks(blocks));
    };

    const onSave = () => {
        setSaving(true);
        Storage.save({blocks, formSettings})
            .catch((error) => alert(error.message))
            .then(({pageSlug}: FormSettings) => {
                dispatch(setFormSettings({pageSlug}));
                dispatch(setIsDirty(false));
                setSaving(false);

                createSuccessNotice(__('Form updated.', 'give'), {
                    type: 'snackbar',
                });
            });
    };

    return (
        <IsolatedBlockEditor
            settings={{iso: isoSettings}}
            // our blocks are already parsed apparently
            //onLoad={(parse) => blocks}
            __experimentalValue={blocks}
            onSaveContent={(html) => console.log(html)}
            onSaveBlocks={dispatchFormBlocks}
            onError={() => document.location.reload()}
        >
            <EditorLoaded
                onLoaded={() => console.log('Editor loaded.')}
                onLoading={() => console.log('Editor loading...')}
            />

            <DocumentSection>
                <FormTab />
            </DocumentSection>

            <EditorHeadingSlot>
                <h1 style={{textAlign: 'center'}} className="editor-heading-slot">
                    {formTitle}
                </h1>
            </EditorHeadingSlot>

            <ToolbarSlot>
                Toolbar Slot
                <Button
                    onClick={onSave}
                    aria-disabled={isSaving || !isDirty}
                    disabled={isSaving || !isDirty}
                    variant="primary"
                >
                    {isSaving ? __('Updating...', 'give') : __('Update', 'give')}
                </Button>
            </ToolbarSlot>
            <ActionArea>Action Area</ActionArea>
            <FooterSlot>Footer Slot</FooterSlot>
            <Feedback />
        </IsolatedBlockEditor>
    );
}

export default App;
