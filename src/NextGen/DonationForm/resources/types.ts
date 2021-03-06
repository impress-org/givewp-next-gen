import {FC} from 'react';

/**
 * Used for a single currency. The amount is an integer in the smallest unit of the currency.
 */
export interface Currency {
    /**
     * Amount as an integer in the smallest unit of the currency.
     */
    amount: bigint;

    /**
     * 3-Character Currency code (e.g. USD, EUR, GBP, etc.)
     */
    currency: string;
}

export interface FormData {
    honorific?: string;
    firstName: string;
    lastName?: string;
    email: string;
    amount: number;
    company?: string;
}

export interface FormServerExports {
    gatewaySettings: {
        [key: string]: GatewaySettings; // key is the gateway ID
    };
    form: {
        nodes: Section[];
    };
    attributes: object;
    donateUrl: string;
    successUrl: string;
}

export interface GatewaySettings {
    label: string;
}

export interface Gateway {
    /**
     * The gateway ID. Must be the same as the back-end
     */
    id: string;

    /**
     * Settings for the gateway as sent from the back-end
     */
    settings?: GatewaySettings;

    /**
     * Initialize function for the gateway. The settings are passed to the gateway
     * from the server. This is called once before the form is rendered.
     */
    initialize?(): void;

    /**
     * The component to render when the gateway is selected
     */
    Fields: FC;

    /**
     * Whether the gateway supports recurring donations
     */
    supportsRecurring: boolean;

    /**
     * Whether the gateway supports the given currency
     */
    supportsCurrency(currency: string): boolean;

    /**
     * A hook before the form is submitted.
     */
    beforeCreatePayment?(values: FormData): Promise<object> | Error;

    /**
     * A hook after the form is submitted.
     */
    afterCreatePayment?(response: object): Promise<void> | Error;
}

export interface Template {
    id: string;
}

export interface VisibilityCondition {
    type: string;
    field: string;
    value: any;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    boolean: 'AND' | 'OR';
}

export interface Node {
    name: string;
    type: string;
    nodeType: string;
    VisibilityConditions: VisibilityCondition[];
}

export interface Field extends Node {
    nodeType: 'field';
    label: string;
    validationRules: {
        [key: string]: any;
    };
    readOnly: boolean;
    defaultValue: any;
    fieldError: string | null;
}

export interface Group extends Node {
    nodeType: 'group';
    nodes: Node[];
}

export interface Element extends Node {
    nodeType: 'element';
}

export interface Section extends Group {
    label: string;
    description: string;
}

export function isField(node: Node): node is Field {
    return node.nodeType === 'field';
}

export function isElement(node: Node): node is Element {
    return node.nodeType === 'element';
}

export function isGroup(node: Node): node is Group {
    return node.nodeType === 'group';
}
