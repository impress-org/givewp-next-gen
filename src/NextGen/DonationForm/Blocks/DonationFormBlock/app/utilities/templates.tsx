import type {FieldErrors, UseFormRegisterReturn} from 'react-hook-form';
import type {FC, FormHTMLAttributes, ReactNode} from 'react';
import {applyFilters} from '@wordpress/hooks';
import {Node, Field, Element, Group, Section} from '@givewp/forms/types';
import {findNode} from './groups';
import {__} from '@wordpress/i18n';
import {ErrorMessage} from '@hookform/error-message';

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

function TextField({label, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="text" {...inputProps} />
        </label>
    );
}

function EmailField({label, inputProps}: FieldProps) {
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

function NameGroup({nodes, inputProps}: GroupProps) {
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

interface SectionProps {
    section: Section;
    children: ReactNode;
}

function SectionLayout({section: {name, label, description}, children}: SectionProps) {
    return (
        <fieldset aria-labelledby={name}>
            <div>
                <h2 id={name}>{label}</h2>
                <em>{description}</em>
            </div>
            <div className="givewp-section-nodes">{children}</div>
        </fieldset>
    );
}

interface FormProps {
    formProps: FormHTMLAttributes<unknown>;
    children: ReactNode;
    formError: string | null;
    isSubmitting: boolean;
}

function Form({children, formProps, formError, isSubmitting}: FormProps) {
    return (
        <form {...formProps}>
            {children}
            {formError && (
                <div className="givewp-error" style={{textAlign: 'center'}}>
                    <p className="givewp-error__label">
                        {__('The following error occurred when submitting the form:', 'give')}
                    </p>
                    <p className="givewp-error__message">{formError}</p>
                </div>
            )}
            <button type="submit" disabled={isSubmitting} className="give-next-gen__submit-button">
                {isSubmitting ? __('Submitting…', 'give') : __('Donate', 'give')}
            </button>
        </form>
    );
}

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
    layouts: {
        section: SectionLayout,
        form: Form,
    },
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

export function getTemplateSection(): FC<SectionProps> {
    return getTemplate<SectionProps>('section', 'layouts');
}

export function getFormTemplate(): FC<FormProps> {
    return getTemplate<FormProps>('form', 'layouts');
}

function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
