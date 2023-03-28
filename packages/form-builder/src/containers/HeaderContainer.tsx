import React, {useContext, useState} from 'react';
import {GiveIcon} from '../components/icons';
import {close, cog, Icon, listView, plus, moreVertical} from '@wordpress/icons';
import {setFormSettings, useFormState, useFormStateDispatch} from '../stores/form-state';
import {RichText} from '@wordpress/block-editor';
import {Button, ExternalLink, TextControl, Dropdown, DropdownMenu, MenuGroup, MenuItem} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {Header} from '../components';
import {Storage} from '../common';
import {FormSettings} from '@givewp/form-builder/types';
import {setIsDirty} from '@givewp/form-builder/stores/form-state/reducer';
import {ShepherdTourContext} from "react-shepherd";

const Logo = () => (
    <div
        style={{
            height: '60px',
            width: '50px',
            backgroundColor: '#FFF',
            display: 'flex',
            alignItems: 'center',
        }}
    >
        <div>
            <a href="edit.php?post_type=give_forms&page=give-forms" title={__('Return to GiveWP', 'give')}>
                <GiveIcon />
            </a>
        </div>
    </div>
);

const HeaderContainer = ({
    selectedSecondarySidebar,
    toggleSelectedSecondarySidebar,
    showSidebar,
    toggleShowSidebar,
    onSaveNotice,
}) => {
    const {blocks, settings: formSettings, isDirty} = useFormState();

    const {formTitle} = formSettings;
    const dispatch = useFormStateDispatch();
    const [isSaving, setSaving] = useState(false);

    const onSave = () => {
        setSaving(true);
        Storage.save({blocks, formSettings})
            .catch((error) => alert(error.message))
            .then(({pageSlug}: FormSettings) => {
                dispatch(setFormSettings({pageSlug}));
                dispatch(setIsDirty(false));
                setSaving(false);
                onSaveNotice();
            });
    };

    // @ts-ignore
    return (
        <Header
            contentLeft={
                <>
                    <Logo />
                    <div id="AddBlockButtonContainer" style={{
                        padding: 'var(--givewp-spacing-2)',
                        margin: 'calc(var(--givewp-spacing-2) * -1)',
                    }}>
                        <Button
                            style={{width: '32px', height: '32px', minWidth: '32px'}}
                            className="rotate-icon"
                            onClick={() => toggleSelectedSecondarySidebar('add')}
                            isPressed={'add' === selectedSecondarySidebar}
                            icon={plus}
                            variant="primary"
                        />
                    </div>
                    <Button
                        style={{width: '32px', height: '32px'}}
                        onClick={() => toggleSelectedSecondarySidebar('list')}
                        isPressed={'list' === selectedSecondarySidebar}
                        icon={listView}
                    />
                </>
            }
            contentMiddle={
                <RichText
                    tagName="div"
                    value={formTitle}
                    onChange={(value) => dispatch(setFormSettings({formTitle: value}))}
                    style={{fontSize: '16px'}}
                />
            }
            contentRight={
                <>
                    <Button
                        onClick={onSave}
                        aria-disabled={isSaving || !isDirty}
                        disabled={isSaving || !isDirty}
                        variant="primary"
                    >
                        {isSaving ? __('Updating...', 'give') : __('Update', 'give')}
                    </Button>
                    <Button onClick={toggleShowSidebar} isPressed={showSidebar} icon={cog} />
                    <Dropdown
                        // className="my-container-class-name"
                        // contentClassName="givewp-sidebar-dropdown-content"
                        // @ts-ignore
                        popoverProps={ { placement: 'bottom-start' } }
                        focusOnMount={"container"}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <Button
                                onClick={onToggle}
                                icon={moreVertical}
                            />
                        ) }
                        renderContent={ ({onClose}) => (
                            <div style={{minWidth: '280px', maxWidth: '400px'}}>
                                <MenuGroup label={__('Tools', 'give')}>
                                    <MenuItem
                                        onClick={() => {
                                            // @ts-ignore
                                            if(!window.tour.isActive()) {
                                                // @ts-ignore
                                                window.tour.start()
                                                onClose()
                                            }
                                        }}
                                    >
                                        {__('Show Guided Tour', 'give')}
                                    </MenuItem>
                                </MenuGroup>
                            </div>
                        )}
                    />
                </>
            }
        />
    );
};


export default HeaderContainer;
