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
                        padding: '30px 20px',
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9.75 10.6521H12C12.2387 10.6521 12.4676 10.5573 12.6364 10.3885C12.8052 10.2198 12.9 9.99088 12.9 9.75223C12.9 9.51359 12.8052 9.28471 12.6364 9.11597C12.4676 8.94722 12.2387 8.85241 12 8.85241H11.1V8.4025C11.1 8.16386 11.0052 7.93498 10.8364 7.76623C10.6676 7.59748 10.4387 7.50268 10.2 7.50268C9.96131 7.50268 9.73239 7.59748 9.56361 7.76623C9.39483 7.93498 9.30001 8.16386 9.30001 8.4025V8.89741C8.75319 9.00842 8.26713 9.31861 7.9362 9.76777C7.60526 10.2169 7.45306 10.773 7.50914 11.328C7.56521 11.8831 7.82557 12.3975 8.23966 12.7714C8.65374 13.1453 9.19203 13.3521 9.75 13.3515H10.65C10.7694 13.3515 10.8838 13.3989 10.9682 13.4833C11.0526 13.5677 11.1 13.6821 11.1 13.8014C11.1 13.9208 11.0526 14.0352 10.9682 14.1196C10.8838 14.2039 10.7694 14.2513 10.65 14.2513H8.40001C8.16131 14.2513 7.93239 14.3461 7.76361 14.5149C7.59483 14.6836 7.50001 14.9125 7.50001 15.1512C7.50001 15.3898 7.59483 15.6187 7.76361 15.7874C7.93239 15.9562 8.16131 16.051 8.40001 16.051H9.30001V16.5009C9.30001 16.7395 9.39483 16.9684 9.56361 17.1372C9.73239 17.3059 9.96131 17.4007 10.2 17.4007C10.4387 17.4007 10.6676 17.3059 10.8364 17.1372C11.0052 16.9684 11.1 16.7395 11.1 16.5009V16.006C11.6468 15.895 12.1329 15.5848 12.4638 15.1356C12.7947 14.6865 12.9469 14.1304 12.8909 13.5754C12.8348 13.0203 12.5744 12.5059 12.1604 12.132C11.7463 11.7581 11.208 11.5513 10.65 11.5519H9.75C9.63066 11.5519 9.5162 11.5045 9.43181 11.4201C9.34742 11.3357 9.30001 11.2213 9.30001 11.102C9.30001 10.9826 9.34742 10.8682 9.43181 10.7838C9.5162 10.6995 9.63066 10.6521 9.75 10.6521ZM20.1 12.0018H17.4V3.9034C17.4006 3.74484 17.3593 3.58893 17.2803 3.45146C17.2013 3.31399 17.0873 3.19983 16.95 3.12055C16.8132 3.04158 16.658 3 16.5 3C16.342 3 16.1868 3.04158 16.05 3.12055L13.35 4.66825L10.65 3.12055C10.5132 3.04158 10.358 3 10.2 3C10.042 3 9.88682 3.04158 9.75 3.12055L7.05001 4.66825L4.35001 3.12055C4.21319 3.04158 4.05799 3 3.90001 3C3.74202 3 3.58682 3.04158 3.45001 3.12055C3.31266 3.19983 3.19871 3.31399 3.11969 3.45146C3.04066 3.58893 2.99938 3.74484 3.00001 3.9034V18.3005C3.00001 19.0165 3.28447 19.7031 3.79082 20.2093C4.29717 20.7156 4.98392 21 5.70001 21H18.3C19.0161 21 19.7028 20.7156 20.2092 20.2093C20.7155 19.7031 21 19.0165 21 18.3005V12.9016C21 12.663 20.9052 12.4341 20.7364 12.2653C20.5676 12.0966 20.3387 12.0018 20.1 12.0018ZM5.70001 19.2004C5.46131 19.2004 5.23239 19.1056 5.06361 18.9368C4.89483 18.7681 4.80001 18.5392 4.80001 18.3005V5.46009L6.60001 6.48588C6.73891 6.55842 6.8933 6.5963 7.05001 6.5963C7.20672 6.5963 7.3611 6.55842 7.50001 6.48588L10.2 4.93819L12.9 6.48588C13.0389 6.55842 13.1933 6.5963 13.35 6.5963C13.5067 6.5963 13.6611 6.55842 13.8 6.48588L15.6 5.46009V18.3005C15.6024 18.6075 15.6572 18.9118 15.762 19.2004H5.70001ZM19.2 18.3005C19.2 18.5392 19.1052 18.7681 18.9364 18.9368C18.7676 19.1056 18.5387 19.2004 18.3 19.2004C18.0613 19.2004 17.8324 19.1056 17.6636 18.9368C17.4948 18.7681 17.4 18.5392 17.4 18.3005V13.8014H19.2V18.3005Z"
                    fill="black" />
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
