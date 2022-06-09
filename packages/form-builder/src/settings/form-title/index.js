import {useContext} from "react";
import {FormTitleContext} from "../../context/formTitle";
import {PanelBody, PanelRow, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";

const FormTitleSettings = () => {

    const [formTitle, setFormTitle] = useContext(FormTitleContext)

    return (
        <PanelBody>
            <PanelRow>
                <TextControl
                    label={__('Form Title')}
                    value={ formTitle }
                    onChange={ setFormTitle }
                />
            </PanelRow>
        </PanelBody>
    )
}

export default FormTitleSettings
