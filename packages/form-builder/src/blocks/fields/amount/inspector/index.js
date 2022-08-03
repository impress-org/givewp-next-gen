import {PanelBody, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {InspectorControls} from "@wordpress/block-editor";
import DeleteButton from "./delete-button";
import AddButton from "./add-button";

const Inspector = (props) => {
    return (
        <InspectorControls>
            <PanelBody title={__('Donation Levels', 'give')} initialOpen={true}>
                {props.attributes.levels.length > 0 && (
                    <ul style={{
                        listStyleType: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {
                            props.attributes.levels.map((label, index) => {
                                return (
                                    <li key={'level-option-inspector-' + index} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <div>
                                            <TextControl
                                                style={{width: '150px'}}
                                                value={label}
                                                onChange={(val) => {
                                                    const levels = [...props.attributes.levels];
                                                    levels[index] = val;
                                                    props.setAttributes({levels: levels});
                                                }}
                                            />
                                        </div>
                                        <TextControlSiblingAlignmentWrapper>
                                            <DeleteButton onClick={() => {
                                                props.attributes.levels.splice(index, 1);
                                                props.setAttributes({levels: props.attributes.levels.slice()});
                                            }} />
                                        </TextControlSiblingAlignmentWrapper>
                                    </li>
                                );
                            })
                        }
                    </ul>
                )}
                <AddButton onClick={() => {
                    const levels = [...props.attributes.levels];
                    levels.push('');
                    props.setAttributes({levels: levels});
                }} />
            </PanelBody>
        </InspectorControls>
    );
};

/**
 * The TextControl components internal wrapper adds a bottom margin.
 * This wrapper components matches that margin for alignment in a row.
 */
const TextControlSiblingAlignmentWrapper = ({children}) => {
    return (
        <div style={{marginBottom: '8px'}}>{children}</div>
    );
};

export default Inspector;
