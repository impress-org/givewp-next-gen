import {PanelHeader, createSlotFill, SearchControl} from '@wordpress/components';
import {__experimentalListView, store} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import BlockTypesList from "@wordpress/block-editor/build/components/block-types-list";
import fieldBlocks from "../../blocks/fields";
import {select, useSelect} from "@wordpress/data";
import {store as blockEditorStore} from "@wordpress/block-editor/build/store";
import {useState} from "react";
import {useImperativeHandle, useRef} from "@wordpress/element";

// const {Fill: InspectorFill} = createSlotFill(
//     'StandAloneBlockEditorSidebarInspector',
// );

function Sidebar(props) {

    console.log('HERE');
    console.log(props);
    // console.log(store.getInsertUsage('custom-block-editor/donor-name'));

    const [blockSearch, setBlockSearch] = useState('');

    const searchRef = useRef();

    const foo = useSelect(select => {
        return select(blockEditorStore);
    });

    const blocksInUse = foo.getBlocks().map(block => {
        return block.innerBlocks.map(innerBlock => innerBlock.name).flat();
    }).flat();

    console.log(blocksInUse);
    console.log(blocksInUse.includes('custom-block-editor/donor-name'));
    console.log(blocksInUse.includes('custom-block-editor/company-field'));

    const blocks = fieldBlocks.map(blockData => {
        console.log(blockData);
        return {
            "id": blockData.name,
            "name": blockData.name,
            "category": blockData.category,
            "title": blockData.settings.title,
            "icon": {
                "src": blockData.settings.icon ?? "block-default",
            },
            "isDisabled": !blockData.settings.supports.multiple && blocksInUse.includes(blockData.name),
            // "frecency": ?,
        };
    });

    const blocksBySection = blocks.reduce((sections, block) => {
        sections[block.category].blocks.push(block);
        return sections;
    }, {
        custom: {name: 'custom', label: __('Custom Fields', 'give'), blocks: []},
        donor: {name: 'donor', label: __('Donor Fields', 'give'), blocks: []},
        payments: {name: 'payments', label: __('Payment Fields', 'give'), blocks: []},
    });
    console.log(blocksBySection);

    const BlockSectionTypesList = () => {
        return Object.values(blocksBySection).map(({name, label, blocks}) => {
            return (
                <>
                    <div style={{
                        color: 'var( --give-gray-50 )',
                        margin: '20px',
                        textTransform: 'uppercase',
                        fontSize: '.9em',
                        fontWeight: 500,
                    }}>{label}</div>
                    <BlockTypesList key={name} items={blocks} />
                </>
            );
        });
    };

    const content = {
        add: () => <BlockSectionTypesList />,
        list: () => <>
            <PanelHeader label={__('List View', 'give')} />
            <__experimentalListView showNestedBlocks={true} expandNested={true} />
        </>,
    };
    const Panel = content[props.selected];

    /* eslint-disable react/jsx-pascal-case */
    return (
        <div
            className="givewp-next-gen-sidebar givewp-next-gen-sidebar-secondary"
            role="region"
            aria-label={__('Standalone Block Editor advanced settings.')}
            tabIndex="-1"
        >
            <Panel />
        </div>
    );
}

// Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
