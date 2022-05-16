import {useFormState} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import PaymentGatewayOption from './PaymentGatewayOption';

interface GatewayNode {
    id: string;
    label: string;
    fields: Function
}

type Props = {
    name: string;
    label: string;
    fields: object[];
};

export default function PaymentDetails({name, label, fields}: Props) {
    const {errors} = useFormState();

    return (
        <fieldset aria-labelledby={name}>
            <div>
                <h2 id={name}>{label}</h2>
            </div>
            <ul style={{listStyleType: 'none', padding: 0}}>
                {fields.map(({id, label, fields}: GatewayNode, index) => (
                    <PaymentGatewayOption fields={fields} id={id} label={label} index={index}/>
                ))}
            </ul>

            <ErrorMessage
                errors={errors}
                name={'gatewayId'}
                render={({message}) => <span className="give-next-gen__error-message">{message}</span>}
            />
        </fieldset>
    );
}
