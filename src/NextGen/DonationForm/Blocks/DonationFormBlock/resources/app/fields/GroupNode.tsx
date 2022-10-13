import buildRegisterValidationOptions from '../utilities/buildRegisterValidationOptions';
import {Field, Group, isField} from '@givewp/forms/types';
import {getGroupTemplate} from '../templates';
import {useFormContext} from 'react-hook-form';
import {useMemo} from 'react';

export default function GroupNode({node}: {node: Group}) {
    const {register} = useFormContext();
    const Group = useMemo(() => getGroupTemplate(node.type), [node.type]);

    const inputProps = node.reduceNodes(
        (inputProps, field: Field) => {
            inputProps[field.name] = register(field.name, buildRegisterValidationOptions(field.validationRules));

            return inputProps;
        },
        {},
        isField
    );

    return <Group key={node.name} inputProps={inputProps} {...node} />;
}
