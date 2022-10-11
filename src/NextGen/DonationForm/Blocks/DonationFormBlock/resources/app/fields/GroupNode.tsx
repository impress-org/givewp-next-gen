import buildRegisterValidationOptions from '../utilities/buildRegisterValidationOptions';
import {Group} from '@givewp/forms/types';
import {getGroupTemplate} from '../templates';
import {useFormContext} from 'react-hook-form';
import {useMemo} from 'react';
import {reduceFields} from '../utilities/groups';

export default function GroupNode({node}: {node: Group}) {
    const {register} = useFormContext();
    const Group = useMemo(() => getGroupTemplate(node.type), [node.type]);

    const inputProps = reduceFields(
        node.nodes,
        (inputProps, field) => {
            inputProps[field.name] = register(field.name, buildRegisterValidationOptions(field.validationRules));

            return inputProps;
        },
        {}
    );

    return <Group key={node.name} inputProps={inputProps} {...node} />;
}
