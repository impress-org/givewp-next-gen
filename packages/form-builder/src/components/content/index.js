import {BlockList, BlockTools, ObserveTyping, WritingFlow} from "@wordpress/block-editor";

const Component = () => {
    return (
        <BlockTools>
            <WritingFlow>
                <ObserveTyping>
                    <BlockList />
                </ObserveTyping>
            </WritingFlow>
        </BlockTools>
    )
}

export default Component