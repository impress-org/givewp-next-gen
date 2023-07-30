export type ConditionalLogicAttribute = {
    enabled: boolean;
    action: 'show' | 'hide';
    boolean: 'and' | 'or';
    rules: ConditionalLogicRule[];
};

export type ConditionalLogicRule = {
    field: string;
    operator: string;
    value: string;
};

export type TranslatableLabels = {
    actions: {
        [key: string]: string;
    };
    booleans: {
        [key: string]: string;
    };
    operators: {
        [key: string]: string;
    };
};
