import buildRegisterValidationOptions from '../utilities/buildRegisterValidationOptions';
import {Group} from '@givewp/forms/types';
import {getGroupTemplate} from '../templates';
import {useFormContext} from 'react-hook-form';
import {useMemo} from 'react';
import getGroupFields from '../utilities/getGroupFields';
import addRequiredToFieldLabel from '../utilities/addRequiredToFieldLabel';

export default function GroupNode({node}: {node: Group}) {
    const {register} = useFormContext();
    const Group = useMemo(() => getGroupTemplate(node.type), [node.type]);
    const fields = node.nodes.reduce(getGroupFields, []);

    fields.forEach((field) => {
        addRequiredToFieldLabel(field);
    });

    const inputProps = fields.reduce((inputProps, field) => {
        inputProps[field.name] = register(field.name, buildRegisterValidationOptions(field.validationRules));

        return inputProps;
    }, {});

    return <Group key={node.name} inputProps={inputProps} {...node} />;
}
