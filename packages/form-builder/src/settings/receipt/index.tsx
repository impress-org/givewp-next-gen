import {PanelBody, PanelRow, TextareaControl, TextControl} from '@wordpress/components';
import {createInterpolateElement} from '@wordpress/element';
import {__} from '@wordpress/i18n';
import {setFormSettings, useFormState, useFormStateDispatch} from '@givewp/form-builder/stores/form-state';

const TemplateTags = () => (
    <dl>
        <dt>
            <code>{'{first_name}'}</code>
        </dt>
        <dd>First name field</dd>
        <dt>
            <code>{'{last_name}'}</code>
        </dt>
        <dd>Last name field</dd>
        <dt>
            <code>{'{email}'}</code>
        </dt>
        <dd>Email field</dd>
    </dl>
);

const ReceiptSettings = () => {
    const {
        settings: {receiptHeading, receiptDescription},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    const headingHelpText = createInterpolateElement(
        __('This is the first message that displays in the receipt. Available template tags are: <tags />', 'give'),
        {
            tags: <TemplateTags />,
        }
    );

    const descriptionHelpText = createInterpolateElement(
        __('This is the second message that displays in the receipt.Available template tags are: <tags />', 'give'),
        {
            tags: <TemplateTags />,
        }
    );

    return (
        <PanelBody title={__('Receipt and Thank You')} initialOpen={false}>
            <PanelRow>
                <TextControl
                    label={__('Heading', 'give')}
                    value={receiptHeading}
                    onChange={(receiptHeading) => dispatch(setFormSettings({receiptHeading}))}
                    help={headingHelpText}
                />
            </PanelRow>
            <PanelRow>
                <TextareaControl
                    label={__('Description', 'give')}
                    value={receiptDescription}
                    onChange={(receiptDescription) => dispatch(setFormSettings({receiptDescription}))}
                    help={descriptionHelpText}
                />
            </PanelRow>
        </PanelBody>
    );
};

export default ReceiptSettings;
