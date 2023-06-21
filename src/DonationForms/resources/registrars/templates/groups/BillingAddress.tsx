import type {BillingAddressProps} from '@givewp/forms/propTypes';

export default function BillingAddress({
    fields: {/*honorific: Honorific,*/ addressLine1: AddressLine1, addressLine2: AddressLine2},
}: BillingAddressProps) {
    return (
        <>
            {/*Honorific && <Honorific />*/}
            <AddressLine1 />
            <AddressLine2 />
        </>
    );
}
