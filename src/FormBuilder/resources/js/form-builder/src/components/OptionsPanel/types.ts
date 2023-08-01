export interface OptionsPanelProps {
    multiple: boolean;
    options: OptionProps[];
    setOptions: (options: OptionProps[]) => void;
}

export interface OptionsListProps {
    options: OptionProps[];
    showValues: boolean;
    multiple: boolean;
    setOptions: (options: OptionProps[]) => void;
}

export interface OptionsItemProps {
    provided: any;
    option: OptionProps;
    showValues: boolean;
    multiple: boolean;
    handleUpdateOptionLabel: (label: string) => void;
    handleUpdateOptionValue: (value: string) => void;
    handleUpdateOptionChecked: (checked: boolean) => void;
    handleRemoveOption: () => void;
}

export interface OptionProps {
    label: string;
    value: string;
    checked: boolean;
}
