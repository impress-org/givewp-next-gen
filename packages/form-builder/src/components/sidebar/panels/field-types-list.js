import {useSelect} from "@wordpress/data";
import {store as blockEditorStore} from "@wordpress/block-editor/build/store";
import fieldBlocks from "../../../blocks/fields";
import {__} from "@wordpress/i18n";
import BlockTypesList from "@wordpress/block-editor/build/components/block-types-list";

const FieldTypesList = () => {

    const store = useSelect(select => {
        return select(blockEditorStore);
    });

    const blocksInUse = store.getBlocks().map(block => {
        return block.innerBlocks.map(innerBlock => innerBlock.name).flat();
    }).flat();

    const blocks = fieldBlocks.map(blockData => {
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

    return Object.values(blocksBySection).map(({name, label, blocks}) => {
        return (
            <>
                <FieldTypeSectionHeader text={label} />
                <BlockTypesList key={name} items={blocks} />
            </>
        );
    });
};

const FieldTypeSectionHeader = ({text}) => {
    return (
        <h3 style={{
            color: 'var( --give-gray-50 )',
            margin: '20px',
            textTransform: 'uppercase',
            fontSize: '.8em',
            fontWeight: 500,
        }}>
            {text}
        </h3>
    );
};

export default FieldTypesList;
