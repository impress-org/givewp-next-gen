import type {giveNextGenExports} from '../types/giveNextGenExports';
import type {Gateway} from "../types/Gateway";

declare global {
    interface Window {
        giveNextGenExports: giveNextGenExports;
        GivePaymentGatewayRegistrar: {
            gateways: Gateway[],
            registerGateway: Function
        }
    }
}

export default function getWindowData() {
    return window.giveNextGenExports;
}
