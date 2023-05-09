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
import React, {useEffect, useState} from 'react';
import {Button, MenuItem} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {Storage} from '@givewp/form-builder/common';
import {FormSettings, FormStatus} from '@givewp/form-builder/types';
import {setIsDirty} from '@givewp/form-builder/stores/form-state/reducer';
import './App.scss';
import {FormTab} from '@givewp/form-builder/components/sidebar/Primary';
import Onboarding from '@givewp/form-builder/components/onboarding';
import {GiveIcon} from '@givewp/form-builder/components/icons';
import {DesignPreview} from '@givewp/form-builder/components/canvas';
import {FormDesignSettings} from '@givewp/form-builder/settings';

const GuidedTourButton = ({onClose}) => {
    return (
        <MenuItem
            onClick={() => {
                // @ts-ignore
                if (!window.tour.isActive()) {
                    // @ts-ignore
                    window.tour.start();
                    onClose();
                }
            }}
        >
            {__('Show Guided Tour', 'give')}
        </MenuItem>
    );
};

const DesignMode = ({isOpen}) => {
    const {openGeneralSidebar, setEditorMode} = useDispatch('isolated/editor');

    useEffect(() => {
        if (isOpen) {
            setEditorMode('design');
            openGeneralSidebar('edit-post/document');
        } else {
            setEditorMode('visual');
        }
    }, [isOpen]);

    return isOpen && <DesignPreview />;
};

const PreviewButton = ({setDesignMode, isDesignMode}) => {
    return (
        <Button
            onClick={() => {
                setDesignMode(!isDesignMode);
            }}
            variant="tertiary"
        >
            {isDesignMode ? 'Exit Design' : 'Design'}
        </Button>
    );
};

const Logo = () => (
    <div
        style={{
            height: '60px',
            width: '50px',
            backgroundColor: '#FFF',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: '1rem',
        }}
    >
        <div>
            <a href="edit.php?post_type=give_forms&page=give-forms" title={__('Return to GiveWP', 'give')}>
                <GiveIcon />
            </a>
        </div>
    </div>
);

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
        undo: true,
        navigation: true,
        documentInspector: 'Form',
        selectorTool: true,
    },
    moreMenu: {
        editor: true,
        topToolbar: true,
        fullscreen: false,
        preview: true,
    },
    linkMenu: [{title: 'Provide Feedback', url: 'https://docs.givewp.com/nextgenfeedback'}],
};

function App() {
    const {blocks, settings: formSettings, isDirty} = useFormState();
    const dispatch = useFormStateDispatch();
    const {createSuccessNotice} = useDispatch('core/notices');
    const [isSaving, setSaving] = useState(false);
    const [isSavingFormStatus, setSavingFormStatus] = useState(null);
    const [isDesignMode, setDesignMode] = useState(false);
    const {formTitle} = formSettings;

    const isDraftDisabled = (isSaving || !isDirty) && 'draft' === formSettings.formStatus;
    const isPublishDisabled = (isSaving || !isDirty) && 'publish' === formSettings.formStatus;

    const dispatchFormBlocks = (blocks) => {
        dispatch(setFormBlocks(blocks));
    };

    const onSave = (formStatus: FormStatus) => {
        setSaving(true);
        setSavingFormStatus(formStatus);

        dispatch(setFormSettings({formStatus}));

        Storage.save({blocks, formSettings: {...formSettings, formStatus}})
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
            settings={{
                iso: isoSettings,
                editor: {
                    allowedBlockTypes: formBuilderBlockNames,
                    isInserterOpened: true,
                },
            }}
            // our blocks are already parsed apparently
            //onLoad={(parse) => blocks}
            __experimentalValue={blocks}
            onSaveContent={(html) => console.log(html)}
            onSaveBlocks={dispatchFormBlocks}
            onError={() => document.location.reload()}
            editorMode={'code'}
            renderMoreMenu={(settings, onClose) => {
                return <GuidedTourButton onClose={onClose} />;
            }}
        >
            <DesignMode isOpen={isDesignMode} />

            <EditorLoaded
                onLoaded={() => console.log('Editor loaded.')}
                onLoading={() => console.log('Editor loading...')}
            />

            <DocumentSection>{isDesignMode ? <FormDesignSettings /> : <FormTab />}</DocumentSection>

            <EditorHeadingSlot>
                <h1 style={{textAlign: 'center'}} className="editor-heading-slot">
                    {formTitle}
                </h1>
            </EditorHeadingSlot>

            <ToolbarSlot>
                <Logo />
                <PreviewButton isDesignMode={isDesignMode} setDesignMode={setDesignMode} />
                <Button
                    onClick={() => onSave('draft')}
                    aria-disabled={isDraftDisabled}
                    disabled={isDraftDisabled}
                    variant="tertiary"
                >
                    {isSaving && 'draft' === isSavingFormStatus
                        ? __('Saving...', 'give')
                        : 'draft' === formSettings.formStatus
                        ? __('Save as Draft', 'give')
                        : __('Switch to Draft', 'give')}
                </Button>
                <Button
                    onClick={() => onSave('publish')}
                    aria-disabled={isPublishDisabled}
                    disabled={isPublishDisabled}
                    variant="primary"
                >
                    {isSaving && 'publish' === isSavingFormStatus
                        ? __('Updating...', 'give')
                        : 'publish' === formSettings.formStatus
                        ? __('Update', 'give')
                        : __('Publish', 'give')}
                </Button>
            </ToolbarSlot>
            <ActionArea>
                <Onboarding />
            </ActionArea>
            <FooterSlot>Footer Slot</FooterSlot>
            <Feedback />
        </IsolatedBlockEditor>
    );
}

export default App;
