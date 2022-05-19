export type Gateway = {
    id: string;
    label: string;
    fields(): string;
    createPayment?(): boolean;
};
