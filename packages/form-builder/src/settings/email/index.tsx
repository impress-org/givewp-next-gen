import {__} from "@wordpress/i18n";
import {
    PanelBody,
    PanelRow,
} from "@wordpress/components";
import EmailTemplateOptions from './template-options';

export default () => {
    return <>
        <PanelBody title={__('Email Settings', 'givewp')} initialOpen={false}>
            <PanelRow>
                <EmailTemplateOptions />
            </PanelRow>
        </PanelBody>
    </>
}
