import {Field, Form, isField, isGroup, Node, Section} from '@givewp/forms/types';
import {getGroupFields} from './groups';

export function getFormFields(form: Form): Field[] {
    return form.nodes.reduce(sectionsReducer, []);
}

function sectionsReducer(fields: Field[], section: Section): Field[] {
    section.nodes.forEach((node: Node) => {
        if (isField(node)) {
            fields.push(node);
        } else if (isGroup(node)) {
            fields.push(...getGroupFields(node));
        }
    });

    return fields;
}
