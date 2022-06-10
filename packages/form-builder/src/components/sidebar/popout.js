import {Fill} from "@wordpress/components";
import {RichText} from "@wordpress/block-editor/build/components";

export default function Popout({ children, content, setContent }) {

    return (
        <Fill name="InspectorPopout">
            <div className="givewp-next-gen-inspector-popout">
                { children }
            </div>
        </Fill>
    )
}

export function PopoutContainer({ children }) {
    return <div className="givewp-next-gen-inspector-popout--container">{ children }</div>
}
