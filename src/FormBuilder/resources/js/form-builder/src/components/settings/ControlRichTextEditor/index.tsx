import type {ReactQuillProps} from 'react-quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps extends ReactQuillProps {}

const defaultFormats = [
    'bold',
    'italic',
    'underline',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
];

const defaultToolbar = ['bold', 'italic', {list: 'ordered'}, {list: 'bullet'}, 'blockquote', 'align', {align: 'center'}, {align: 'right'},'link', 'image'];

/**
 * @unreleased
 *
 * @see https://github.com/zenoamaro/react-quill
 */
export default function ControlRichTextEditor({onChange, value, formats, modules, ...props}: RichTextEditorProps) {
    return (
        <div className="givewp-ql-text-editor">
            <ReactQuill
                theme="snow"
                defaultValue={value}
                value={value}
                onChange={onChange}
                modules={modules || {toolbar: defaultToolbar}}
                formats={formats || defaultFormats}
                bounds=".givewp-ql-text-editor"
                {...props}
            />
        </div>
    );
}
