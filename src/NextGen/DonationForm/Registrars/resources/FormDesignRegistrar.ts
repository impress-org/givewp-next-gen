import type {FormDesign} from '@givewp/forms/types';

/**
 * @unreleased
 */
export interface FormDesignRegistrar {
    mount(design: FormDesign): void;

    get(): FormDesign;
}

/**
 * @unreleased
 */
export default class Registrar implements FormDesignRegistrar {
    private designs: FormDesign[] = [];

    public mount(design: FormDesign): void {
        this.designs.push(design);
    }

    public get(): FormDesign {
        const givewp = this.designs.find(({id}) => id === 'givewp');
        const active = this.designs[this.designs.length - 1];

        return mergeDesigns(givewp, active);
    }

    public getAll(): FormDesign[] {
        return this.designs;
    }
}

/**
 *
 * @unreleased
 */
const mergeDesigns = (defaultFormDesign: FormDesign, activeFormDesign: FormDesign): FormDesign => {
    return {
        id: activeFormDesign.id,
        fields: {
            ...defaultFormDesign.fields,
            ...activeFormDesign?.fields,
        },
        elements: {
            ...defaultFormDesign.elements,
            ...activeFormDesign?.elements,
        },
        groups: {
            ...defaultFormDesign.groups,
            ...activeFormDesign?.groups,
        },
        layouts: {
            ...defaultFormDesign.layouts,
            ...activeFormDesign?.layouts,
        },
    };
};
