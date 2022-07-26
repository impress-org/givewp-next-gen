import buildRegisterValidationOptions from "../utilities/buildRegisterValidationOptions";
import {Field, isElement, isField, isGroup, Node} from '@givewp/forms/types';
import {getElementTemplate, getFieldTemplate, getGroupTemplate} from '../templates';
import getErrorByFieldName from "../utilities/getErrorByFieldName";
import {useFormContext, useFormState} from "react-hook-form";
import getGroupFields from "../utilities/getGroupFields";
import {useMemo} from "react";

export default function SectionNode({node}: {node: Node}) {
    const {register} = useFormContext();
    const {errors} = useFormState();

    if (isField(node)) {
        const Field = useMemo(() => getFieldTemplate(node.type),[node.type]);
        const inputProps = register(node.name, buildRegisterValidationOptions(node.validationRules));

        return <Field key={node.name} inputProps={inputProps}
                      fieldError={getErrorByFieldName(errors, node.name)}
                      {...node} />;
    } else if (isElement(node)) {
        const Element = useMemo(() => getElementTemplate(node.type),[node.type]);
        return <Element key={node.name} {...node} />;
    } else if (isGroup(node)) {
        const Group = useMemo(() => getGroupTemplate(node.type),[node.type]);
        const fields = node.nodes.reduce(getGroupFields, []);

        const inputProps = fields.reduce((inputProps, field) => {
            inputProps[field.name] = register(
                field.name,
                buildRegisterValidationOptions(field.validationRules)
            );

            return inputProps;
        }, {});

        return <Group key={node.name} inputProps={inputProps} {...node} />;
    } else {
        return null;
    }
}

