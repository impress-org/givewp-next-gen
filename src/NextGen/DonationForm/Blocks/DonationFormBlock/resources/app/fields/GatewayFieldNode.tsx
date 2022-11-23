import {Field} from '@givewp/forms/types';
import {getGatewaysFieldTemplate} from '../templates';
import {useMemo} from 'react';
import registerFieldAndBuildProps from '../utilities/registerFieldAndBuildProps';
import {useGiveDonationFormStore} from '@givewp/blocks/form/app/store';

export default function GatewayFieldNode({node}: {node: Field}) {
    const {register} = window.givewp.form.hooks.useFormContext();
    const {errors} = window.givewp.form.hooks.useFormState();
    const Field = useMemo(() => getGatewaysFieldTemplate(), [node.type]);
    const fieldProps = registerFieldAndBuildProps(node, register, errors);
    const {gateways} = useGiveDonationFormStore();

    return <Field key={node.name} {...fieldProps} gateways={gateways} />;
}
