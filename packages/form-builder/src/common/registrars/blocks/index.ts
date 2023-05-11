import {FieldBlock, SectionBlock} from '@givewp/form-builder/types/block';
import {BlockSupports, registerBlockType} from '@wordpress/blocks';

/**
 * @unreleased
 */
const supportOverrides: BlockSupports = {
    customClassName: false,
    html: false,
};

/**
 * @unreleased
 */
enum BlockListTypes {
    Parent = 'parent',
    Child = 'child',
}

/**
 * @unreleased
 */
interface BlocksList {
    [BlockListTypes.Parent]: SectionBlock[];
    [BlockListTypes.Child]: FieldBlock[];
}

/**
 * @unreleased
 */
interface Registrar {
    register(blocks: FieldBlock | FieldBlock[], parent?: string[]): void;

    getAll(type: BlockListTypes): FieldBlock[];

    get(id: string): FieldBlock | undefined;
}

/**
 * @unreleased
 */
class BlockRegistrar implements Registrar {
    /**
     * @unreleased
     */
    private blocks: BlocksList = {
        [BlockListTypes.Parent]: [],
        [BlockListTypes.Child]: [],
    };

    /**
     * @unreleased
     */
    public get(name: string): FieldBlock | undefined {
        return [...this.blocks.parent, ...this.blocks.child].find((block: FieldBlock) => block.name === name);
    }

    /**
     * @unreleased
     */
    public getAll(type: BlockListTypes = BlockListTypes.Child): FieldBlock[] {
        if (!this.blocks.hasOwnProperty(type)) {
            type = BlockListTypes.Child;
        }

        return this.blocks[type];
    }

    /**
     * @unreleased
     */
    public register(blocks: FieldBlock | FieldBlock[], parent: string[] = []): void {
        if (!Array.isArray(blocks)) {
            blocks = [blocks];
        }

        blocks.forEach((block: FieldBlock) => {
            this.blocks[parent.length ? BlockListTypes.Child : BlockListTypes.Parent].push(block);
            this.registerIntoEditor(block, parent);
        });
    }

    /**
     * @unreleased
     */
    private registerIntoEditor(block: FieldBlock, parent: string[]): void {
        const {name, settings} = block;

        registerBlockType(name, {
            ...settings,
            parent,
            supports: {
                ...settings.supports,
                ...supportOverrides,
            },
        });
    }
}

export default new BlockRegistrar();
