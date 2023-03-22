import {ShortcutProvider} from '@wordpress/keyboard-shortcuts';
import BlockEditorContainer from './containers/BlockEditorContainer';
import {FormStateProvider} from './stores/form-state';
import {Storage} from './common';
import defaultBlocks from './blocks.json';
import Feedback from '@givewp/form-builder/feedback';
import {BlockInstance} from '@wordpress/blocks';

import './App.scss';
import Onboarding from "@givewp/form-builder/components/onboarding";

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
    return (
        <Onboarding>
            <FormStateProvider initialState={initialState}>
                <ShortcutProvider>
                    <BlockEditorContainer />
                    <Feedback />
                </ShortcutProvider>
            </FormStateProvider>
        </Onboarding>
    );
}

export default App;
