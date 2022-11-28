import {Field} from '@givewp/forms/types';
import registerFieldAndBuildProps from '../utilities/registerFieldAndBuildProps';
import {useGiveDonationFormStore} from '@givewp/blocks/form/app/store';
import {withTemplateWrapper} from '@givewp/blocks/form/app/templates';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();
const GatewayFieldTemplate = withTemplateWrapper(formDesign.fields.gateways);

export default function GatewayFieldNode({node}: {node: Field}) {
    const {register} = window.givewp.form.hooks.useFormContext();
    const {errors} = window.givewp.form.hooks.useFormState();
    const fieldProps = registerFieldAndBuildProps(node, register, errors);
    const {gateways} = useGiveDonationFormStore();

    return <GatewayFieldTemplate key={node.name} {...fieldProps} gateways={gateways} />;
}
