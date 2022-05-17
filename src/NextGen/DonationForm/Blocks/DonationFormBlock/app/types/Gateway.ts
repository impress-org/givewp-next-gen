type Gateway = {
    id: string;
    label: string;
    fields: Function;
    createPayment?: Function;
};

export default Gateway;
