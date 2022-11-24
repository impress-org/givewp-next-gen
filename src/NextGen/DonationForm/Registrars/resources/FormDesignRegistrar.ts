import type {FormDesign} from '@givewp/forms/types';

/**
 * @unreleased
 */
export interface FormDesignRegistrar {
    mount(design: FormDesign): void;

    get(): FormDesign;

    getAll(): FormDesign[];
}

/**
 * @unreleased
 */
export default class Registrar implements FormDesignRegistrar {
    private designs: FormDesign[] = [];

    /**
     * Mounting a form design allows for overriding form design templates
     *
     * @unreleased
     */
    public mount(design: FormDesign): void {
        this.designs.push(design);
    }

    /**
     * Retrieve the final form design structure by merging designs in cascading order.
     *
     * @unreleased
     */
    public get(): FormDesign {
        return this.designs.reduce((previousFormDesign: FormDesign, nextFormDesign: FormDesign) =>
            mergeFormDesigns(previousFormDesign, nextFormDesign)
        );
    }

    /**
     * Retrieve all form designs that have been mounted.
     *
     * @unreleased
     */
    public getAll(): FormDesign[] {
        return this.designs;
    }
}

/**
 * @unreleased
 */
const mergeFormDesigns = (previousFormDesign: FormDesign, nextFormDesign: FormDesign): FormDesign => {
    return {
        id: nextFormDesign.id,
        fields: {
            ...previousFormDesign.fields,
            ...nextFormDesign?.fields,
        },
        elements: {
            ...previousFormDesign.elements,
            ...nextFormDesign?.elements,
        },
        groups: {
            ...previousFormDesign.groups,
            ...nextFormDesign?.groups,
        },
        layouts: {
            ...previousFormDesign.layouts,
            ...nextFormDesign?.layouts,
        },
    };
};
