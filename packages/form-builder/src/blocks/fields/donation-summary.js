import {Icon} from '@wordpress/icons';
import {__} from "@wordpress/i18n";
import settings from "./settings";

import './donation-summary.scss';
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
        },
        edit: (props) => {
            const {
                attributes: {label},
                setAttributes,
            } = props;
            return (
                <>
                    <div className="give-donation-summary-section">
                        <div className="give-donation-summary-table-wrapper">

                            <table>
                                <thead>
                                <tr>
                                    <RichText
                                        tagName="th"
                                        value={label}
                                        onChange={(val) => setAttributes({label: val})}
                                        style={{borderBottom: '0.0625rem solid #ddd'}}
                                    />
                                    <th>{/* this section intentionally left blank */}</th>
                                </tr>
                                </thead>
                                <tbody>

                                {/*PAYMENT AMOUNT*/}
                                <tr>
                                    <td>
                                        <div>{__('Payment Amount', 'give')}</div>
                                    </td>
                                    <td data-tag="amount">{'{' + __('amount', 'give') + '}'}</td>
                                </tr>


                                {/*GIVING FREQUENCY*/}
                                <tr>
                                    <td>
                                        <div>{__('Giving Frequency', 'give')}</div>
                                    </td>
                                    <td>
                                        <span data-tag="recurring"></span>
                                        <span data-tag="frequency">{'{' + __('frequency', 'give') + '}'}</span>
                                    </td>
                                </tr>

                                {/*COVER DONATION FEES GOES HERE*/}

                                </tbody>
                                <tfoot>
                                {/*TOTAL DONATION AMOUNT (INCLUDING FEES)*/}
                                <tr>
                                    <th>{__('Donation Total', 'give')}</th>
                                    <th data-tag="total">{'{' + __('total', 'give') + '}'}</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
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

export default DonationSummary;
