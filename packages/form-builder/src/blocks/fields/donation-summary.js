import {Icon} from '@wordpress/icons';
import {__} from "@wordpress/i18n";
import settings from "./settings";

import {InspectorControls, RichText} from "@wordpress/block-editor";
import {PanelBody, PanelRow, TextControl} from "@wordpress/components";

const DonationSummary = {
    name: 'custom-block-editor/donation-summary',
    category: 'input',
    settings: {
        ...settings,
        title: __('Donation Summary', 'give'),
        supports: {
            multiple: false,
        },
        attributes: {
            lock: {remove: false},
            label: {
                type: 'string',
                source: 'attribute',
                default: __('Donation Summary', 'give'),
            },
            description: {
                type: 'string',
                source: 'attribute',
                default: __('Here is what you are about to donate', 'give'),
            },
        },
        edit: (props) => {
            const {
                attributes: {label, description},
                setAttributes,
            } = props;
            return (
                <>
                    <div style={{
                        marginBottom: '40px',
                        padding: '20px',
                        display: 'flex',
                        gap: '16px',
                        flexDirection: 'column',
                        border: '1px dashed var(--give-gray-100)',
                        borderRadius: '5px',
                        backgroundColor: 'var(--give-gray-10)',
                    }}>
                        <RichText
                            tagName="div"
                            value={description}
                            onChange={(val) => setAttributes({description: val})}
                            style={{fontSize: '18px', fontWeight: 500, textAlign: 'center'}}
                        />
                        <RichText
                            tagName="div"
                            value={label}
                            onChange={(val) => setAttributes({label: val})}
                            style={{fontSize: '18px', fontWeight: 500}}
                        />
                        <LineItem label={__('Payment amount', 'give')} />
                        <LineItem label={__('Giving frequency', 'give')} />
                        <LineItem label={__('Donation Total', 'give')} style={{fontWeight: 'bold'}} />
                    </div>
                    <InspectorControls>
                        <PanelBody title={__('Field Settings', 'give')} initialOpen={true}>
                            <PanelRow>
                                <TextControl
                                    label={'Label'}
                                    value={label}
                                    onChange={(val) => setAttributes({label: val})}
                                />
                            </PanelRow>
                            <PanelRow>
                                <TextControl
                                    label={'Description'}
                                    value={description}
                                    onChange={(val) => setAttributes({description: val})}
                                />
                            </PanelRow>
                        </PanelBody>
                    </InspectorControls>
                </>
            );
        },
        icon: () => <Icon icon={
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        } />,
    },
};

const LineItem = ({label, style}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div {...style}>{label}</div>
            <div style={{height: '20px', width: '120px', backgroundColor: 'var(--give-gray-30)'}}></div>
        </div>
    );
};

export default DonationSummary;
