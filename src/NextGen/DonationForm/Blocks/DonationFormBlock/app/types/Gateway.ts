export type Gateway = {
    id: string;
    label: string;
    fields(): string;
    beforeCreatePayment?(values: any): boolean;
};
