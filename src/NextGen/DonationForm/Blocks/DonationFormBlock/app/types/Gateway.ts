export type Gateway = {
    id: string;
    label: string;
    fields(): string;
    createPayment?(values: any): boolean;
};
