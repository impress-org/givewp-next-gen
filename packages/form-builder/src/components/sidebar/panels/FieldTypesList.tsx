import {useSelect} from '@wordpress/data';
import {store as blockEditorStore} from '@wordpress/block-editor/build/store';
import {__} from '@wordpress/i18n';
import {SearchControl} from '@wordpress/block-editor';
import {useState} from 'react';
import {BlockInstance} from '@wordpress/blocks';
import fieldBlocks from '@givewp/form-builder/blocks/fields';
import elementBlocks from '@givewp/form-builder/blocks/elements';
import BlockTypesList from '@givewp/form-builder/components/forks/block-types-list';
import {FieldBlock} from '@givewp/form-builder/types';

const FieldTypesList = () => {
    const [searchValue, setSearchValue] = useState<string>('');

    const store = useSelect<any>((select) => {
        return select(blockEditorStore);
    }, []);

    const blocksInUse = store
        .getBlocks()
        .map((block: BlockInstance) => {
            return block.innerBlocks.map((innerBlock) => innerBlock.name).flat();
        })
        .flat();

    const blocks = [...fieldBlocks, ...elementBlocks].map((blockData: FieldBlock) => {
        return {
            id: blockData.name,
            name: blockData.name,
            category: blockData.settings.category,
            title: blockData.settings.title,
            icon: {
                src: blockData.settings.icon ?? 'block-default',
            },
            isDisabled: !(blockData.settings.supports.multiple ?? true) && blocksInUse.includes(blockData.name),
            // "frecency": ?, // Note: This is not FreQuency, but rather FreCency with combines Frequency with Recency for search ranking.
        };
    });

    const blocksFiltered = blocks.filter((block) => block.name.includes(searchValue.toLowerCase().replace(' ', '-')));

    const blocksBySection = blocksFiltered.reduce(
        (sections, block) => {
            sections[block.category].blocks.push(block);
            return sections;
        },
        {
            // @todo: Figure out how to handle third-party (or add-on) field categories.
            content: {name: 'content', label: __('Content & Media', 'give'), blocks: []},
            input: {name: 'input', label: __('Input Fields', 'give'), blocks: []},
            custom: {name: 'custom', label: __('Custom Fields', 'give'), blocks: []},
        }
    );

    return (
        <div className="givewp-next-gen-sidebar__inner">
            <SearchControl value={searchValue} onChange={setSearchValue} />
            <div className="givewp-next-gen-sidebar__inner--blocks">
                {Object.values(blocksBySection)
                    .filter((section) => section.blocks.length)
                    .map(({name, label, blocks}) => {
                        return (
                            <>
                                <h3 className="givewp-next-gen-sidebar__heading">{label}</h3>
                                <BlockTypesList
                                    key={name}
                                    items={blocks}
                                    onSelect={undefined}
                                    children={undefined}
                                    label={undefined}
                                />
                            </>
                        );
                    })}
            </div>
        </div>
    );
};

export default FieldTypesList;
