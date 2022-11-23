import {isElement, isField, isGroup, Node} from '@givewp/forms/types';
import FieldNode from './FieldNode';
import ElementNode from './ElementNode';
import GroupNode from './GroupNode';
import GatewayFieldNode from '@givewp/blocks/form/app/fields/GatewayFieldNode';

/**
 * Determine which node template to render
 *
 * @unreleased
 */
export default function SectionNode({node}: {node: Node}) {
    if (isField(node)) {
        if (node.type === 'gateways') {
            return <GatewayFieldNode node={node} />;
        }
        return <FieldNode node={node} />;
    } else if (isElement(node)) {
        return <ElementNode node={node} />;
    } else if (isGroup(node)) {
        return <GroupNode node={node} />;
    } else {
        return null;
    }
}
