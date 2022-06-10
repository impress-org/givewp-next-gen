import {Fill, Slot} from "@wordpress/components";
import {RichText} from "@wordpress/block-editor/build/components";

export default function Popout({ children }) {

    return (
        <Fill name="InspectorPopout">
            <div className="givewp-next-gen-inspector-popout">
                { children }
            </div>
        </Fill>
    )
}

export const PopoutSlot = () => <Slot name="InspectorPopout" />

export const PopoutContainer = ({ children }) => <div className="givewp-next-gen-inspector-popout--container">{ children }</div>
