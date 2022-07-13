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
        <header style={{height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <section style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                <div style={{
                    height: '60px',
                    width: '60px',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{marginLeft: '-7px'}}>
                        <a href={'edit.php?post_type=give_forms&page=give-forms'} title={'Return to GiveWP'}>
                            <GiveIcon />
                        </a>
                    </div>
                </div>
                <ListIcon onClick={toggleSecondarySidebar} isActive={showSecondarySidebar} />
            </section>
            <section>
                <RichText
                    tagName="div"
                    value={formTitle}
                    onChange={(value) => updateFormSetting({formTitle: value})}
                    style={{margin: '40px'}}
                />
            </section>
            <section style={{marginRight: '20px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                <Button onClick={onSave} disabled={isSaving} variant="primary">
                    {isSaving ? __('Publishing...', 'give') : __('Publish', 'give')}
                </Button>
                <SettingsIcon onClick={toggleShowSidebar} isActive={showSidebar} />
            </section>
        </header>
    );
};

export default Component;
