import {ShortcutProvider} from '@wordpress/keyboard-shortcuts';
import BlockEditorContainer from './containers/BlockEditorContainer';
import {FormStateProvider} from './stores/form-state';
import {Storage} from './common';
import defaultBlocks from './blocks.json';
import Feedback from '@givewp/form-builder/feedback';
import {BlockInstance} from '@wordpress/blocks';

import './App.scss';

const {blocks: initialBlocks, formSettings: initialFormSettings} = Storage.load();

const initialState = {
    blocks: initialBlocks || (defaultBlocks as BlockInstance[]),
    settings: {
        ...initialFormSettings,
    },
};

if (initialBlocks instanceof Error) {
    alert('Unable to load initial blocks.');
    console.error(initialBlocks);
}

function App() {
    // return (
    //     <IsolatedBlockEditor
    //         settings={{}}
    //         onSaveContent={(html) => console.log(html)}
    //         onLoad={(parse) => console.log(parse)}
    //         onError={() => document.location.reload()}
    //     >
    //         <EditorLoaded onLoaded={() => {}} onLoading={() => {}} />
    //         <DocumentSection>Extra Information</DocumentSection>
    //
    //         <ToolbarSlot>
    //             <button>Beep!</button>
    //         </ToolbarSlot>
    //     </IsolatedBlockEditor>
    // );

    return (
        <FormStateProvider initialState={initialState}>
            <ShortcutProvider>
                <BlockEditorContainer />
                <Feedback />
            </ShortcutProvider>
        </FormStateProvider>
    );
}

export default App;
