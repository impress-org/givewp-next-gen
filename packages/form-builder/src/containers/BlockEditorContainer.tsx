import {BlockEditorProvider, BlockInspector} from '@wordpress/block-editor';
import {Popover, SlotFillProvider} from '@wordpress/components';

import {Sidebar} from '../components';

import {setFormBlocks, useFormState, useFormStateDispatch} from '../stores/form-state';
import BlockEditorInterfaceSkeletonContainer
    from "@givewp/form-builder/containers/BlockEditorInterfaceSkeletonContainer";

/**
 * @since 0.1.0
 */
export default function BlockEditorContainer() {
    const {blocks} = useFormState();
    const dispatch = useFormStateDispatch();
    const dispatchFormBlocks = (blocks) => {
        dispatch(setFormBlocks(blocks));
    };

    return (
        <BlockEditorProvider value={blocks} onInput={dispatchFormBlocks} onChange={dispatchFormBlocks}>
            <SlotFillProvider>
                <Sidebar.InspectorFill>
                    <BlockInspector/>
                </Sidebar.InspectorFill>
                <BlockEditorInterfaceSkeletonContainer/>
                <Popover.Slot/>
            </SlotFillProvider>
        </BlockEditorProvider>
    );
}
