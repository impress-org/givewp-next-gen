export type FieldSettings = {
    label: boolean;
    name: boolean;
    placeholder: boolean;
    required: boolean;
    storeAsDonorMeta: boolean;
    displayInAdmin: boolean;
    displayInReceipt: boolean;
};

export type FieldSettingsSupport = FieldSettings | true;

export type FieldAttributes = {
    [key: string]: {
        type: string;
        default: string | boolean;
        required?: boolean;
    };
}
