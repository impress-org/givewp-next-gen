import type {BillingAddressProps} from '@givewp/forms/propTypes';

export default function BillingAddress({
    fields: {
        country: Country,
        addressLine1: AddressLine1,
        addressLine2: AddressLine2,
        city: City,
        state: State,
        zipPostalCode: ZipPostalCode,
    },
}: BillingAddressProps) {
    return (
        <>
            <Country />
            <AddressLine1 />
            <AddressLine2 />
            <City />
            <State />
            <ZipPostalCode />
        </>
    );
}
