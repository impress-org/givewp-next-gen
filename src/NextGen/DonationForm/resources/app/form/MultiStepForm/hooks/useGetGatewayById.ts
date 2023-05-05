import {useCallback} from 'react';
import {useDonationFormState} from '@givewp/forms/app/store';

export default function useGetGatewayById() {
    const {gateways} = useDonationFormState();

    return useCallback((gatewayId: string) => gateways?.find(({id}) => id === gatewayId), []);
}