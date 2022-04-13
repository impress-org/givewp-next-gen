import React, { useState } from 'react';

import { parse } from '@wordpress/blocks'
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import {__experimentalListView, BlockEditorProvider, BlockInspector} from '@wordpress/block-editor';
import { SlotFillProvider, Popover } from '@wordpress/components';
import { InterfaceSkeleton } from "@wordpress/interface";

import Header from './components/header'
import { Sidebar, SecondarySidebar } from './components/sidebar'
import Content from './components/content'

import { useToggleState } from "./hooks";

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';

import './App.scss';

function App() {

    const {
        state: showSecondarySidebar,
        toggle: toggleSecondarySidebar
    } = useToggleState( false )

    const {
        state: showSidebar,
        toggle: toggleShowSidebar
    } = useToggleState( true )

    const [ blocks, updateBlocks ] = useState(parse(`
        <!-- wp:custom-block-editor/donation-amount /-->
        <!-- wp:custom-block-editor/donor-info /-->
    `));

    return (
        <ShortcutProvider>
            <BlockEditorProvider
                value={ blocks }
                onInput={ ( blocks ) => updateBlocks( blocks ) }
                onChange={ ( blocks ) => updateBlocks( blocks ) }
            >
                <SlotFillProvider>
                    <Sidebar.InspectorFill>
                        <BlockInspector />
                    </Sidebar.InspectorFill>
                    <InterfaceSkeleton
                        header={ <Header
                            toggleSecondarySidebar={toggleSecondarySidebar}
                            toggleShowSidebar={toggleShowSidebar}
                        /> }
                        content={ <Content /> }
                        sidebar={ !! showSidebar && <Sidebar /> }
                        secondarySidebar={ !! showSecondarySidebar && <SecondarySidebar /> }
                    />
                    <Popover.Slot />
                </SlotFillProvider>
            </BlockEditorProvider>
        </ShortcutProvider>
    );
}

export default App;
