import FieldInterface from './FieldInterface';

export type giveNextGenExports = {
    form: {
        nodes: FieldInterface[];
    };
    attributes: object;
    donateUrl: string;
    successUrl: string;
    stripeKey: string;
    stripeConnectAccountId: string;
    stripeClientSecret: string;
};
