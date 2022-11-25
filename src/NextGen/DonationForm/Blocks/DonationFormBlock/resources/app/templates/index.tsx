import type {FC, ReactNode} from 'react';
import {useMemo} from 'react';
import {applyFilters} from '@wordpress/hooks';
import type {FormDesign} from '@givewp/forms/types';
import type {ElementProps, FieldProps, GroupProps,} from '@givewp/forms/propTypes';
import getFormDesign from "@givewp/blocks/form/app/utilities/getFormDesign";

/**
 * Get the active template from the window
 *
 * @unreleased
 */
const template: FormDesign = getFormDesign();

/**
 * Get the NodeWrapper from active template
 *
 * @unreleased
 */
const NodeWrapper = template.layouts.wrapper;

/**
 * Find the names of nodeType and type based on the value of the template.
 *
 * @unreleased
 */
export function findTemplateKeys<S extends keyof typeof template, T extends keyof typeof template[S]>(
    templateValue: ReactNode
): {nodeType: S | null; type: T | null} {
    let nodeType = null;
    let type = null;

    Object.entries(template).forEach((firstLevel) => {
        if (typeof firstLevel[1] === 'object') {
            const firstLevelKey = firstLevel[0];
            const secondLevelKeys = Object.keys(firstLevel[1]);
            const templateType = secondLevelKeys.find((key) => firstLevel[1][key] === templateValue);

            if (templateType) {
                type = templateType;
                nodeType = firstLevelKey;
            }
        }
    });

    return {nodeType, type};
}

/**
 * This template wrapper will render and figure out what props to pass the wrapper supplied by the active design based on it child component.
 *
 * @unreleased
 */
export function TemplateWrapper({children, htmlTag}: { children: JSX.Element, htmlTag?: keyof JSX.IntrinsicElements }) {
    const {nodeType, type} = useMemo(() => findTemplateKeys(children.type), []);

    return (
        <NodeWrapper nodeType={nodeType} type={type} htmlTag={htmlTag}>
            {children}
        </NodeWrapper>
    );
}

/**
 * @unreleased
 */
export function withWrapper(NodeComponent: FC, nodeType, type, htmlTag: keyof JSX.IntrinsicElements = 'div') {
    return (props) => {
        return (
            <NodeWrapper nodeType={nodeType} type={type} htmlTag={htmlTag}>
                <NodeComponent {...props} />
            </NodeWrapper>
        );
    };
}

/**
 * The following functions are used to retrieve the various templates for the form.
 *
 * @unreleased
 */
function getTemplate<NodeProps>(type: string, section: string, htmlTag?: keyof JSX.IntrinsicElements): FC<NodeProps> {
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

/**
 * @unreleased
 */
export function getFieldTemplate(type: string): FC<FieldProps> {
    return getTemplate<FieldProps>(type, 'fields');
}

/**
 * @unreleased
 */
export function getElementTemplate(type: string): FC<ElementProps> {
    return getTemplate<ElementProps>(type, 'elements');
}

/**
 * @unreleased
 */
export function getGroupTemplate(type: string): FC<GroupProps> {
    return getTemplate<GroupProps>(type, 'groups');
}

/**
 * @unreleased
 */
function nodeIsFunctionalComponent(Node: unknown): Node is FC {
    return typeof Node === 'function';
}
