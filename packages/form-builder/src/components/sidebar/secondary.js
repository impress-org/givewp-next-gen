import {__} from '@wordpress/i18n';
import FieldTypesList from "./panels/field-types-list";
import BlockListTree from "./panels/block-list-tree";

function Sidebar(props) {

    const panels = {
        add: () => <FieldTypesList />,
        list: () => <BlockListTree />,
    };

    const PanelContent = panels[props.selected];

    /* eslint-disable react/jsx-pascal-case */
    return (
        <div
            className="givewp-next-gen-sidebar givewp-next-gen-sidebar-secondary"
            role="region"
            aria-label={__('Standalone Block Editor advanced settings.')}
            tabIndex="-1"
        >
            <PanelContent />
        </div>
    );
}

export default Sidebar;
