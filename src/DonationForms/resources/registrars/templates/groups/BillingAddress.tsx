import type {BillingAddressProps} from '@givewp/forms/propTypes';

export default function BillingAddress({
    fields: {country: Country, address1: Address1, address2: Address2, city: City, state: State, zip: Zip},
}: BillingAddressProps) {
    return (
        <>
            <Country />
            <Address1 />
            <Address2 />
            <City />
            <State />
            <Zip />
        </>
    );
}
