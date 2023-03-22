import {BlockList, BlockTools, DefaultBlockAppender, ObserveTyping, WritingFlow} from '@wordpress/block-editor';

const FormBlocks = () => {
    return (
        <div id="FormBlocksCanvas" style={{padding: '58px', margin: '-58px'}}>
            <BlockTools>
                <WritingFlow>
                    <ObserveTyping>
                        <BlockList renderAppender={DefaultBlockAppender} />
                    </ObserveTyping>
                </WritingFlow>
            </BlockTools>
        </div>

    );
};

export default FormBlocks;
