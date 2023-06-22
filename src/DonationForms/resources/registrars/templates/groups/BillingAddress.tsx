import type {BillingAddressProps} from '@givewp/forms/propTypes';

export default function BillingAddress({
    fields: {country: Country, addressLine1: AddressLine1, addressLine2: AddressLine2},
}: BillingAddressProps) {
    return (
        <>
            <Country />
            <AddressLine1 />
            <AddressLine2 />
        </>
    );
}
