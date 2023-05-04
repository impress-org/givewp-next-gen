import {FieldBlock} from '@givewp/form-builder/types';

/**
 * @unreleased
 */
interface Registrar {
    register(block: FieldBlock): void;

    getAll(): FieldBlock[];

    get(id: string): FieldBlock | undefined;
}

/**
 * @unreleased
 */
class BlockRegistrar implements Registrar {
    /**
     * @unreleased
     */
    private blocks: FieldBlock[] = [];

    /**
     * @unreleased
     */
    public get(name: string): FieldBlock | undefined {
        return this.blocks.find((block: FieldBlock) => block.name === name);
    }

    /**
     * @unreleased
     */
    public getAll(): FieldBlock[] {
        return this.blocks;
    }

    /**
     * @unreleased
     */
    public register(block: FieldBlock): void {
        this.blocks.push(block);
    }
}

export default new BlockRegistrar();
