import {useFormState} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import {useGiveDonationFormStore} from '../../store';
import PaymentGatewayOption from '../../fields/PaymentGatewayOption';

export default function Gateways() {
    const {errors} = useFormState();
    const {gateways} = useGiveDonationFormStore();

    return (
        <>
            <ul style={{listStyleType: 'none', padding: 0}}>
                {gateways.map((gateway, index) => (
                    <PaymentGatewayOption gateway={gateway} index={index} key={gateway.id} />
                ))}
            </ul>

            <ErrorMessage
                errors={errors}
                name={'gatewayId'}
                render={({message}) => <span className="give-next-gen__error-message">{message}</span>}
            />
        </>
    );
}
