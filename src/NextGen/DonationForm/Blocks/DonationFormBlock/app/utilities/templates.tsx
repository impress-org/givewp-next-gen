import type {UseFormRegisterReturn} from 'react-hook-form';
import type {FC, ReactNode} from 'react';
import {applyFilters} from '@wordpress/hooks';
import {Node, Field, Element, Group, Section} from '@givewp/forms/types';
import {findNode} from './groups';

export interface FieldProps extends Field {
    inputProps: UseFormRegisterReturn;
}

export interface ElementProps extends Element {}

export interface GroupProps extends Group {
    inputProps: {
        [key: string]: UseFormRegisterReturn;
    };
}

function NodeWrapper({type, nodeType, children}: {type: string; nodeType: string; children: ReactNode}) {
    return <div className={`givewp-${nodeType} givewp-${nodeType}-${type}`}>{children}</div>;
}

function withWrapper(NodeComponent) {
    return (node: Node, ...props) => (
        <NodeWrapper type={node.type} nodeType={node.nodeType}>
            <NodeComponent {...node} {...props} />
        </NodeWrapper>
    );
}

function TextField({label, type, nodeType, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="text" {...inputProps} />
        </label>
    );
}

function EmailField({label, type, nodeType, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="email" {...inputProps} />
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

function HiddenField({inputProps}: FieldProps) {
    return <input type="hidden" {...inputProps} />;
}

function HtmlElement({html}: {html: string}) {
    return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function NameGroup({type, nodeType, nodes, inputProps}: GroupProps) {
    const firstName = findNode('firstName', nodes) as Field;
    const lastName = findNode('lastName', nodes) as Field | null;
    const honorific = findNode('honorific', nodes) as Field | null;

    return (
        <>
            {honorific && <TextField inputProps={inputProps['honorific']} {...honorific} />}
            <TextField inputProps={inputProps['firstName']} {...firstName} />
            {lastName && <TextField inputProps={inputProps['lastName']} {...lastName} />}
        </>
    );
}

function Section(section: Section) {}

const templates = {
    fields: {
        text: TextField,
        textarea: TextAreaField,
        email: EmailField,
        hidden: HiddenField,
    },
    elements: {
        html: HtmlElement,
    },
    groups: {
        name: NameGroup,
    },
    layouts: {},
};

function getTemplate<NodeProps>(type: string, section: string): FC<NodeProps> {
    const Node = templates[section].hasOwnProperty(type) ? withWrapper(templates[section][type]) : null;

    let FilteredNode = applyFilters(`givewp/form/${section}/${type}`, Node);
    FilteredNode = applyFilters(`givewp/form/${section}`, Node, type);

    if (nodeIsFunctionalComponent(FilteredNode)) {
        return FilteredNode as FC<NodeProps>;
    } else {
        throw new Error(`Invalid field type: ${type}`);
    }
}

export function getTemplateField(type: string): FC<FieldProps> {
    return getTemplate<FieldProps>(type, 'fields');
}

export function getTemplateElement(type: string): FC<ElementProps> {
    return getTemplate<ElementProps>(type, 'elements');
}

export function getTemplateGroup(type: string): FC<GroupProps> {
    return getTemplate<GroupProps>(type, 'groups');
}

function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
