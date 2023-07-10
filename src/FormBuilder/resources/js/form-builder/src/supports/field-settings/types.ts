export type FieldSettings = {
    label: FieldSettingProperty;
    name: FieldSettingProperty;
    placeholder: FieldSettingProperty;
    description: FieldSettingProperty;
    required: FieldSettingProperty;
    storeAsDonorMeta: FieldSettingProperty;
    displayInAdmin: FieldSettingProperty;
    displayInReceipt: FieldSettingProperty;
};

export type FieldSettingsSupport =
    | true
    | {
          label: FieldSettingProperty | boolean;
          name: FieldSettingProperty | boolean;
          placeholder: FieldSettingProperty | boolean;
          description: FieldSettingProperty | boolean;
          required: FieldSettingProperty | boolean;
          storeAsDonorMeta: FieldSettingProperty | boolean;
          displayInAdmin: FieldSettingProperty | boolean;
          displayInReceipt: FieldSettingProperty | boolean;
      };

export type FieldSettingProperty =
    | false
    | {
          default: any;
      };

export type FieldAttributes = {
    [key: string]: {
        type: string;
        default?: string | boolean;
        required?: boolean;
    };
};
