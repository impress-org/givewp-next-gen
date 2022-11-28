import {Field} from '@givewp/forms/types';
import {useTemplateWrapper} from '../templates';
import registerFieldAndBuildProps from '../utilities/registerFieldAndBuildProps';
import type {FieldProps} from '@givewp/forms/propTypes';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();

export default function FieldNode({node}: {node: Field}) {
    const {register} = window.givewp.form.hooks.useFormContext();
    const {errors} = window.givewp.form.hooks.useFormState();
    const Field = useTemplateWrapper<FieldProps>(formDesign.fields[node.type], 'div', node.name);
    const fieldProps = registerFieldAndBuildProps(node, register, errors);

    return <Field key={node.name} {...fieldProps} />;
}
