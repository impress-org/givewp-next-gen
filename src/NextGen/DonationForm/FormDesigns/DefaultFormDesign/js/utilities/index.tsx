import {ReactNode} from 'react';
import type {Element} from '@givewp/forms/types';
import classNames from 'classnames';

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
