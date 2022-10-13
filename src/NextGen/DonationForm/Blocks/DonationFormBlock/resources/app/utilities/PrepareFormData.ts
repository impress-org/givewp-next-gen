import {Form, Node, Group, isField, isGroup} from '@givewp/forms/types';
import generateRequiredLabel from './generateRequiredLabel';
import {mapGroup, reduceGroup, walkGroup} from './groups';

/**
 * Receives the form data as provided directly from the server and mutates it to be ready for use by the React application
 *
 * @unreleased
 */
export default function prepareFormData(form: Form) {
    form.walkNodes = walkGroupNodes.bind(form);
    form.mapNodes = mapGroupNodes.bind(form);
    form.reduceNodes = reduceGroupNodes.bind(form);

    form.walkNodes((node: Node) => {
        if (isField(node)) {
            node.requiredLabel = generateRequiredLabel(node.label, node.validationRules.required);
        } else if (isGroup(node)) {
            node.walkNodes = walkGroupNodes.bind(node);
            node.mapNodes = mapGroupNodes.bind(node);
            node.reduceNodes = reduceGroupNodes.bind(node);
        }
    });
}

function walkGroupNodes(this: Group, callback: (node: Node) => void, filter?: (node: Node) => boolean) {
    walkGroup(this, callback, filter);
}

function mapGroupNodes(this: Group, callback: (node: Node) => void, filter?: (node: Node) => boolean) {
    return mapGroup(this, callback, filter);
}

function reduceGroupNodes(
    this: Group,
    callback: (accumulator: any, node: Node) => any,
    initialValue: any,
    filter?: (node: Node) => boolean
) {
    return reduceGroup(this, callback, initialValue, filter);
}
