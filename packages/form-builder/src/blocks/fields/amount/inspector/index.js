import {PanelBody} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {InspectorControls} from "@wordpress/block-editor";
import DeleteButton from "./delete-button";
import AddButton from "./add-button";

const Inspector = ({attributes, setAttributes}) => {

    const {levels} = attributes;

    return (
        <InspectorControls>
            <PanelBody title={__('Donation Levels', 'give')} initialOpen={true}>
                {levels.length > 0 && (
                    <ul style={{
                        listStyleType: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {
                            levels.map((label, index) => {
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
                                                <span style={{marginBottom: '1px'}}>$</span>
                                            </div>
                                            <input
                                                style={{
                                                    width: '140px',
                                                    padding: '6px 0 6px 30px',
                                                }}
                                                value={label}
                                                onChange={(element) => {
                                                    const newLevels = [...levels];
                                                    newLevels[index] = element.target.value;
                                                    setAttributes({levels: newLevels});
                                                }}
                                            />
                                        </div>
                                        <DeleteButton onClick={() => {
                                            levels.splice(index, 1);
                                            setAttributes({levels: levels.slice()});
                                        }} />
                                    </li>
                                );
                            })
                        }
                    </ul>
                )}
                <AddButton onClick={() => {
                    const newLevels = [...levels];
                    newLevels.push('');
                    setAttributes({levels: newLevels});
                }} />
            </PanelBody>
        </InspectorControls>
    );
};

export default Inspector;
