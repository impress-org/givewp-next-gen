import {__} from "@wordpress/i18n";

import LevelGrid from "./level-grid";
import LevelButton from "./level-buttons";
import Inspector from "./inspector";

const Edit = ({attributes, setAttributes}) => {

    const {levels} = attributes;

    return (
        <>
            <div>
                <div>
                    <input style={{width: '100%', marginBottom: '20px'}} type="text" />
                </div>
                {levels.length > 0 && (
                    <LevelGrid>
                        {levels.map((level, index) => <LevelButton key={index}>${level}</LevelButton>)}
                        <LevelButton>{__('Custom Amount', 'give')}</LevelButton>
                    </LevelGrid>
                )}
            </div>

            <Inspector attributes={attributes} setAttributes={setAttributes} />
        </>
    );
};

export default Edit;
