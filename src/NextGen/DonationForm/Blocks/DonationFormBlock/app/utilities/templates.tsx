import type {UseFormRegisterReturn} from 'react-hook-form';
import type {FC, ReactNode} from 'react';
import {applyFilters} from '@wordpress/hooks';
import {Node, Field, Element, Group} from '@givewp/forms/types';

export interface FieldProps extends Field {
    inputProps: UseFormRegisterReturn;
}

export interface ElementProps extends Element {}

export interface GroupProps extends Group {
    inputProps: {
        [key: string]: UseFormRegisterReturn;
    };
}

function NodeWrapper({node, children}: {node: Node; children: ReactNode}) {
    return <div className={`givewp-${node.nodeType} givewp-${node.nodeType}-${node.type}`}>{children}</div>;
}

function TextField({label, type, nodeType, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="text" {...inputProps} />
        </label>
    );
}

function TextAreaField({label, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <textarea {...inputProps} />
        </label>
    );
}

function HtmlElement({html}: {html: string}) {
    return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function NameGroup() {}

const defaultFieldTemplates = {
    text: TextField,
    textarea: TextAreaField,
};

const defaultElementTemplates = {
    html: HtmlElement,
};

const groupTemplates = {
    name: NameGroup,
};

export function getTemplateField(type: string): FC<FieldProps> {
    let Field = null;
    if (defaultFieldTemplates.hasOwnProperty(type)) {
        Field = defaultFieldTemplates[type];
    }

    const FilteredField = applyFilters('givewp/form/field', Field, type);

    if (nodeIsFunctionalComponent(FilteredField)) {
        return FilteredField as FC<FieldProps>;
    } else {
        throw new Error(`Invalid field type: ${type}`);
    }
}

export function getTemplateElement(type: string): FC<ElementProps> {
    let Element = null;
    if (defaultElementTemplates.hasOwnProperty(type)) {
        Element = defaultElementTemplates[type];
    }

    const FilteredElement = applyFilters('givewp/form/element', Element, type);

    if (nodeIsFunctionalComponent(FilteredElement)) {
        return FilteredElement as FC<ElementProps>;
    } else {
        throw new Error(`Invalid element type: ${type}`);
    }
}

export function getTemplateGroup(type: string): FC<GroupProps> {
    let Group = null;
    if (groupTemplates.hasOwnProperty(type)) {
        Group = groupTemplates[type];
    }

    const FilteredGroup = applyFilters('givewp/form/element', Group, type);

    if (nodeIsFunctionalComponent(FilteredGroup)) {
        return FilteredGroup as FC<GroupProps>;
    } else {
        throw new Error(`Invalid element type: ${type}`);
    }
}

function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
