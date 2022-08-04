import {PanelBody} from "@wordpress/components";
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
                                        <div style={{position: 'relative'}}>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '13px',
                                                    fontSize: '.8em',
                                                }}>
                                                <spann style={{marginBottom: '1px'}}>$</spann>
                                            </div>
                                            <input
                                                style={{
                                                    width: '140px',
                                                    padding: '6px 0 6px 30px',
                                                }}
                                                value={label}
                                                onChange={(val) => {
                                                    const levels = [...props.attributes.levels];
                                                    levels[index] = val;
                                                    props.setAttributes({levels: levels});
                                                }}
                                            />
                                        </div>
                                        <DeleteButton onClick={() => {
                                            props.attributes.levels.splice(index, 1);
                                            props.setAttributes({levels: props.attributes.levels.slice()});
                                        }} />
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

export default Inspector;
