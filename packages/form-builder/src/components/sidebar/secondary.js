import {PanelHeader} from '@wordpress/components';
import {__experimentalListView as ListView} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import BlockTypesList from "@wordpress/block-editor/build/components/block-types-list";
import fieldBlocks from "../../blocks/fields";
import {useSelect} from "@wordpress/data";
import {store as blockEditorStore} from "@wordpress/block-editor/build/store";

function Sidebar(props) {

    const store = useSelect(select => {
        return select(blockEditorStore);
    });

    const blocksInUse = store.getBlocks().map(block => {
        return block.innerBlocks.map(innerBlock => innerBlock.name).flat();
    }).flat();

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
            "isDisabled": !(blockData.settings.supports.multiple ?? true) && blocksInUse.includes(blockData.name),
            // "frecency": ?, // Note: This is not FreQuency, but rather FreCency with combines Frequency with Recency for search ranking.
        };
    });

    const blocksBySection = blocks.reduce((sections, block) => {
        sections[block.category].blocks.push(block);
        return sections;
    }, {
        input: {name: 'input', label: __('Input Fields', 'give'), blocks: []},
        custom: {name: 'custom', label: __('Custom Fields', 'give'), blocks: []},
    });

    const BlockSectionTypesList = () => {
        return Object.values(blocksBySection).map(({name, label, blocks}) => {
            return (
                <>
                    <div style={{
                        color: 'var( --give-gray-50 )',
                        margin: '20px',
                        textTransform: 'uppercase',
                        fontSize: '.8em',
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
            <ListView showNestedBlocks={true} expandNested={true} />
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

export default Sidebar;
