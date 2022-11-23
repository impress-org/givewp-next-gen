import type {FC, ReactNode} from 'react';
import classNames from 'classnames';
import {applyFilters} from '@wordpress/hooks';
import type {Element, FormDesign} from '@givewp/forms/types';
import type {
    ElementProps,
    FieldErrorProps,
    FieldLabelProps,
    FieldProps,
    FormProps,
    GatewayFieldProps,
    GoalProps,
    GroupProps,
    HeaderDescriptionProps,
    HeaderProps,
    HeaderTitleProps,
    SectionProps,
} from '@givewp/forms/propTypes';

export function NodeWrapper({
    type,
    nodeType,
    htmlTag: Element = 'div',
    name,
    children,
}: {
    type: string;
    nodeType: string;
    htmlTag?: keyof JSX.IntrinsicElements;
    name?: string;
    children: ReactNode;
}) {
    return (
        <Element
            className={classNames(`givewp-${nodeType}`, `givewp-${nodeType}-${type}`, {
                [`givewp-${nodeType}-${type}-${name}`]: name,
            })}
        >
            {children}
        </Element>
    );
}

export function withWrapper(NodeComponent, section, type, htmlTag) {
    return (props) => {
        return (
            <NodeWrapper type={type} nodeType={section} htmlTag={htmlTag}>
                <NodeComponent {...props} />
            </NodeWrapper>
        );
    };
}

// Retrieve the active form design and apply any overrides to generate the final templates.
const template: FormDesign = window.givewp.form.designs.get();

// The following functions are used to retrieve the various templates for the form.
function getTemplate<NodeProps>(type: string, section: string, htmlTag?: string): FC<NodeProps> {
    const Node = template[section].hasOwnProperty(type)
        ? withWrapper(template[section][type], section, type, htmlTag)
        : null;

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

export function getGatewaysFieldTemplate(): FC<GatewayFieldProps> {
    return getTemplate<GatewayFieldProps>('gateways', 'fields');
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

export function getFieldLabelTemplate(): FC<FieldLabelProps> {
    return getTemplate('fieldLabel', 'layouts');
}

export function getFieldErrorTemplate(): FC<FieldErrorProps> {
    return getTemplate('fieldError', 'layouts');
}

export function getHeaderTemplate(): FC<HeaderProps> {
    return getTemplate('header', 'layouts');
}

export function getHeaderTitleTemplate(): FC<HeaderTitleProps> {
    return getTemplate('headerTitle', 'layouts');
}

export function getHeaderDescriptionTemplate(): FC<HeaderDescriptionProps> {
    return getTemplate('headerDescription', 'layouts');
}

export function getGoalTemplate(): FC<GoalProps> {
    return getTemplate('goal', 'layouts');
}

function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
