import {Field, Group, isField} from '@givewp/forms/types';
import {useTemplateWrapper} from '../templates';
import type {GroupProps} from '@givewp/forms/propTypes';
import getFormDesign from '@givewp/forms/app/utilities/getFormDesign';
import FieldNode from '@givewp/forms/app/fields/FieldNode';

const formDesign = getFormDesign();

export default function GroupNode({node}: {node: Group}) {
    const Group = useTemplateWrapper<GroupProps>(formDesign.groups[node.type], 'div', node.name);

    const fields = node.reduceNodes(
        (fields, field: Field) => {
            fields[field.name] = () => <FieldNode node={field} />;

            return fields;
        },
        {},
        isField
    );

    return <Group key={node.name} fields={fields} {...node} />;
}
