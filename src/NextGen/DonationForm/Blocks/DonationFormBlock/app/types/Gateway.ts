export type Gateway = {
    id: string;
    label: string;
    fields: Function;
    createPayment?: Function;
};
