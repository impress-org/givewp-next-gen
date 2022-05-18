import type {giveNextGenExports} from '../types/giveNextGenExports';

declare global {
    interface Window {
        giveNextGenExports: giveNextGenExports;
        givewp: {
            gateways
        }
    }
}

export default function getWindowData() {
    return window.giveNextGenExports;
}
