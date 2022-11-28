import {elementExists, fieldExists, groupExists, isElement, isField, isGroup, Node} from '@givewp/forms/types';
import FieldNode from './FieldNode';
import ElementNode from './ElementNode';
import GroupNode from './GroupNode';
import GatewayFieldNode from '@givewp/blocks/form/app/fields/GatewayFieldNode';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();

/**
 * Determine which node template to render
 *
 * @unreleased
 */
export default function SectionNode({node}: {node: Node}) {
    if (isField(node) && fieldExists(node, formDesign)) {
        if (node.type === 'gateways') {
            return <GatewayFieldNode node={node} />;
        }
        return <FieldNode node={node} />;
    } else if (isElement(node) && elementExists(node, formDesign)) {
        return <ElementNode node={node} />;
    } else if (isGroup(node) && groupExists(node, formDesign)) {
        return <GroupNode node={node} />;
    } else {
        console.error(`Node: ${JSON.stringify(node)} does not exist in Form Design: ${JSON.stringify(formDesign)}`);

        return null;
    }
}
