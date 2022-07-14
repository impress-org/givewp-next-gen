import GiveIcon from "./give-icon";
import React, {useState} from "react";
import {ListIcon, SettingsIcon} from "../icons";
import {useFormSettings} from "../../settings/context";
import {RichText} from "@wordpress/block-editor";
import {Button} from "@wordpress/components";
import {__} from "@wordpress/i18n";

const Component = ({saveCallback, showSecondarySidebar, toggleSecondarySidebar, showSidebar, toggleShowSidebar}) => {

    const [{formTitle}, updateFormSetting] = useFormSettings();


    const [isSaving, setSaving] = useState(false);

    const onSave = () => {
        setSaving(true);
        saveCallback().finally(() => {
            setSaving(false);
        });
    };

    return (
        <header style={{
            height: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem'
        }}>
            <section style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexBasis: '20%'
            }}>
                <div style={{
                    height: '60px',
                    width: '60px',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div>
                        <a href={'edit.php?post_type=give_forms&page=give-forms'} title={'Return to GiveWP'}>
                            <GiveIcon/>
                        </a>
                    </div>
                </div>
                <Button onClick={toggleSecondarySidebar} isPressed={showSecondarySidebar} icon={<ListIcon/>}/>
            </section>
            <section>
                <RichText
                    tagName="div"
                    value={formTitle}
                    onChange={(value) => updateFormSetting({formTitle: value})}
                />
            </section>
            <section style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexBasis: '20%',
                justifyContent: 'flex-end',
            }}>
                <Button onClick={onSave} disabled={isSaving} variant="primary">
                    {isSaving ? __('Publishing...', 'give') : __('Publish', 'give')}
                </Button>
                <Button onClick={toggleShowSidebar} isPressed={showSidebar} icon={<SettingsIcon/>}/>
            </section>
        </header>
    );
};

export default Component;
