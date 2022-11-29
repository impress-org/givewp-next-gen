import {useState} from "react";
import AceEditor from "react-ace";
import debounce from 'lodash.debounce';
import {__} from "@wordpress/i18n";
import { fullscreen } from '@wordpress/icons';
import {Button, Modal, PanelBody, PanelRow} from "@wordpress/components";

import "ace-builds/src-noconflict/mode-css";
import 'ace-builds/src-noconflict/snippets/css';
import "ace-builds/src-noconflict/theme-textmate";
import {setFormSettings, useFormState, useFormStateDispatch} from "@givewp/form-builder/stores/form-state";

const CustomStyleSettings = () => {

    const [ isOpen, setOpen ] = useState( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );

    return (
        <PanelBody title={__('Custom Styles', 'givewp')} initialOpen={false}>
            <PanelRow>

                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <Button icon={fullscreen} onClick={ openModal }>
                        { __( 'Edit in Modal', 'givewp' ) }
                    </Button>

                    <div style={{
                        margin: '.5rem -16px -16px -16px', // Offset the panel padding in order to fill the inspector width.
                    }}>
                        <CodeControl />
                    </div>

                </div>

                { !! isOpen && (
                    <Modal title={ __( 'Custom Styles', 'givewp' ) } onRequestClose={ closeModal } style={{
                        height: '100%',
                        maxHeight: '100%', // Override the max height of the modal component.
                        width: '500px',
                        position: 'absolute',
                        right: '0',
                    }}>
                        <div style={{
                            margin: '-25px -31px -23px -31px', // Offset the modal padding in order to fill the available space.
                        }}>
                            <CodeControl />
                        </div>
                    </Modal>
                ) }

            </PanelRow>
        </PanelBody>
    )
}

const CodeControl = () => {

    const {
        settings: {customCss},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    return (
        <AceEditor
            mode="css"
            theme="textmate"
            onLoad={ ( editor ) => {
                editor.renderer.setScrollMargin( 8, 8, 8, 8 );
                editor.renderer.setPadding( 8 );
            } }
            onChange={debounce((customCss) => dispatch(setFormSettings({customCss})),500)}
            showPrintMargin={false}
            highlightActiveLine={ false }
            showGutter={true}
            fontSize={12}
            value={ customCss }
            maxLines={ Infinity }
            minLines={ 5 }
            width="100%"
            height="500px"
            setOptions={ {
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
            } }
            style={{
                height: 'calc(100vh-60px)',
            }}
        />
    )
}

export default CustomStyleSettings
