import {__} from "@wordpress/i18n";
import {
    Button,
    PanelBody,
    PanelRow, SelectControl, TextControl,
} from "@wordpress/components";
import { MediaPlaceholder } from '@wordpress/block-editor';
import EmailTemplateOptions from './template-options';
import { useState } from "react";
import LogoUpload from "./logo-upload";

export default () => {

    const [status, setStatus] = useState('enabled');
    const [template, setTemplate] = useState('default');
    const [fromName, setFromName] = useState('');
    const [fromEmail, setFromEmail] = useState('');

    return <>
        <PanelBody title={__('Email Settings', 'givewp')} initialOpen={false}>
            <PanelRow>
                <SelectControl
                    label={__('Email Options', 'givewp')}
                    options={[
                        {label: __('Customize', 'givewp'), value: 'enabled'},
                    ]}
                    value={status}
                    onChange={(value) => setStatus(value)}
                    />
            </PanelRow>
            <PanelRow>
                <SelectControl
                    label={__('Email Template', 'givewp')}
                    help={__('Choose your template from the available registered template types', 'givewp')}
                    options={[
                        {label: __('Default template', 'givewp'), value: 'default'},
                        {label: __('No template, plain text only', 'givewp'), value: 'none'},
                    ]}
                    value={template}
                    onChange={(value) => setTemplate(value)}
                />
            </PanelRow>
            <PanelRow>
                <LogoUpload />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__('From Name', 'givewp')}
                    help={__('The name which appears in the "From" field in all GiveWP donation emails.', 'givewp')}
                    value={fromName}
                    onChange={(value) => setFromName(value)}
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__('From Email', 'givewp')}
                    help={__('Email address from which all GiveWP emails are sent from. This will act as the "from" and "reply-to" email address.', 'givewp')}
                    value={fromEmail}
                    onChange={(value) => setFromEmail(value)}
                />
            </PanelRow>
            <PanelRow>
                <EmailTemplateOptions />
            </PanelRow>
        </PanelBody>
    </>
}
