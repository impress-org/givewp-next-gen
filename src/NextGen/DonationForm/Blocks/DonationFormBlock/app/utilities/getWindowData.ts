import type {giveNextGenExports} from '../types/giveNextGenExports';
import {Gateway} from "../types/Gateway";

declare global {
    interface Window {
        giveNextGenExports: giveNextGenExports;
        givewp: {
            gateways: {
                getAll(): Gateway[]
                registerGateway(gateway: Gateway): Function
            },
        }
    }
}

export default function getWindowData() {
    return window.giveNextGenExports;
}
