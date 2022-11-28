import {Field, Group, isField} from '@givewp/forms/types';
import {useTemplateWrapper} from '../templates';
import registerFieldAndBuildProps from '../utilities/registerFieldAndBuildProps';
import type {GroupProps} from '@givewp/forms/propTypes';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();

export default function GroupNode({node}: {node: Group}) {
    const {register} = window.givewp.form.hooks.useFormContext();
    const {errors} = window.givewp.form.hooks.useFormState();
    const Group = useTemplateWrapper<GroupProps>(formDesign.groups[node.type]);

    const fieldProps = node.reduceNodes(
        (fieldProps, field: Field) => {
            fieldProps[field.name] = registerFieldAndBuildProps(field, register, errors);

            return fieldProps;
        },
        {},
        isField
    );

    return <Group key={node.name} fieldProps={fieldProps} {...node} />;
}
