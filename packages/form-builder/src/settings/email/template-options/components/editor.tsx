import ReactQuill from "react-quill";
import {useEffect, useRef} from "react";
import _ from "lodash";
import {__} from "@wordpress/i18n";

/**
 * https://github.com/zenoamaro/react-quill
 *
 * @param onChange
 * @param value
 */
const Editor = ({onChange, value}) => {

    // The media library uses Backbone.js, which can conflict with lodash.
    _.noConflict();
    let frame;

    const editorRef = useRef();

    const openMediaLibrary = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (frame) {
            frame.open()
            return
        }

        frame = window.wp.media({
            title: __('Add or upload file', 'givewp'),
            button: {
                text: __('Use this media', 'givewp'),
            },
            multiple: false, // Set to true to allow multiple files to be selected
        })

        frame.on( 'select', function() {

            // Get media attachment details from the frame state
            var attachment = frame.state().get('selection').first().toJSON();

            // @ts-ignore
            const editor = editorRef.current.getEditor()
            const cursorPosition = editor.getSelection()?.index ?? 0;
            editor.insertEmbed(cursorPosition, 'image', attachment.url);
            editor.setSelection(cursorPosition + 1);
        });

        // Finally, open the modal on click
        frame.open()
    }

    useEffect(() => {
        const mediaToolbarButton = document.querySelector('.ql-wpmedia')
        if(mediaToolbarButton) {
            mediaToolbarButton.addEventListener('click', openMediaLibrary);
            return () => {
                mediaToolbarButton.removeEventListener('click', openMediaLibrary);
            }
        }
    }, []);

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    return (
        <div className="text-editor">

            <CustomToolbar>
                <button id='ql-wpmedia' className="ql-wpmedia" onClick={openMediaLibrary}>
                    <MediaIcon />
                </button>
            </CustomToolbar>

            <ReactQuill
                ref={editorRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
        </div>
    )
}

const CustomToolbar = ({children}) => {
    return (
        <div id="toolbar">
            <select
                className="ql-header"
                defaultValue={''}
                onChange={(e) => e.persist()}
            >
                <option value="1"></option>
                <option value="2"></option>
                <option selected></option>
            </select>
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-blockquote"></button>
            <button className="ql-underline"></button>
            <button className="ql-link"></button>

            {children}

        </div>
    )
}

const MediaIcon = () => {
    return (
        <svg viewBox="0 0 18 18">
            <rect className="ql-stroke" height="10" width="12" x="3" y="4"></rect>
            <circle className="ql-fill" cx="6" cy="7" r="1"></circle>
            <polyline className="ql-even ql-fill"
                      points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
        </svg>
    )
}

export default Editor;
