import {__} from "@wordpress/i18n";

import LevelGrid from "./level-grid";
import LevelButton from "./level-buttons";
import Inspector from "./inspector";

const Edit = (props) => {
    return (
        <>
            <div>
                <div>
                    <input style={{width: '100%', marginBottom: '20px'}} type="text" />
                </div>
                {props.attributes.levels.length > 0 && (
                    <LevelGrid>
                        {props.attributes.levels.map((level, index) => <LevelButton>${level}</LevelButton>)}
                        <LevelButton>{__('Custom Amount', 'give')}</LevelButton>
                    </LevelGrid>
                )}
            </div>

            <Inspector {...props} />
        </>
    );
};

export default Edit;
