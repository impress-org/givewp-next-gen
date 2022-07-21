import {ElementType, FC, ReactNode} from 'react';
import {applyFilters} from '@wordpress/hooks';
import {Element, Field, Group} from '@givewp/forms/types';
import {UseFormRegisterReturn} from 'react-hook-form';
import TextField from './fields/Text';
import TextAreaField from './fields/TextArea';
import EmailField from './fields/Email';
import HiddenField from './fields/Hidden';
import HtmlElement from './elements/Html';
import NameGroup from './groups/Name';
import SectionLayout, {SectionProps} from './layouts/Section';
import Form, {FormProps} from './layouts/Form';
import AmountField from './fields/Amount';

export interface FieldProps extends Field {
    inputProps: UseFormRegisterReturn;
}

export interface ElementProps extends Element {}

export interface GroupProps extends Group {
    inputProps: {
        [key: string]: UseFormRegisterReturn;
    };
}

function NodeWrapper({
                         type,
                         nodeType,
                         htmlTag: Element = 'div',
                         children
                     }: { type: string; nodeType: string; htmlTag?: ElementType; children: ReactNode }) {
    return <Element className={`givewp-${nodeType} givewp-${nodeType}-${type}`}>{children}</Element>;
}

function withWrapper(NodeComponent, section, type, htmlTag) {
    return (props) => {
        return (
            <NodeWrapper type={type} nodeType={section} htmlTag={htmlTag}>
                <NodeComponent {...props} />
            </NodeWrapper>
        );
    };
}

const defaultTemplate = {
    fields: {
        amount: AmountField,
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
    layouts: {
        section: SectionLayout,
        form: Form,
    },
};

const activeTemplate = window.givewp.template.get();

const template = {
    fields: {
        ...defaultTemplate.fields,
        ...activeTemplate?.fields
    },
    elements: {
        ...defaultTemplate.elements,
        ...activeTemplate?.elements
    },
    groups: {
        ...defaultTemplate.groups,
        ...activeTemplate?.groups
    },
    layouts: {
        ...defaultTemplate.layouts,
        ...activeTemplate?.layouts
    },
}

function getTemplate<NodeProps>(type: string, section: string, htmlTag?: string): FC<NodeProps> {
    const Node = template[section].hasOwnProperty(type) ? withWrapper(template[section][type], section, type, htmlTag) : null;

    let FilteredNode = applyFilters(`givewp/form/${section}/${type}`, Node);
    FilteredNode = applyFilters(`givewp/form/${section}`, Node, type);

    if (nodeIsFunctionalComponent(FilteredNode)) {
        return FilteredNode as FC<NodeProps>;
    } else {
        throw new Error(`Invalid field type: ${type}`);
    }
}

export function getFieldTemplate(type: string): FC<FieldProps> {
    return getTemplate<FieldProps>(type, 'fields');
}

export function getElementTemplate(type: string): FC<ElementProps> {
    return getTemplate<ElementProps>(type, 'elements');
}

export function getGroupTemplate(type: string): FC<GroupProps> {
    return getTemplate<GroupProps>(type, 'groups');
}

export function getSectionTemplate(): FC<SectionProps> {
    return getTemplate<SectionProps>('section', 'layouts', 'section');
}

export function getFormTemplate(): FC<FormProps> {
    return getTemplate<FormProps>('form', 'layouts');
}

function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
