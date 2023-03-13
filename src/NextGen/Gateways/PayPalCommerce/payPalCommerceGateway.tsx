import {
    PayPalButtons,
    PayPalScriptProvider,
    PayPalHostedFieldsProvider, PayPalHostedField,
} from "@paypal/react-paypal-js";
import type {Gateway} from '@givewp/forms/types';

let payPalDonationsSettings;
let payPalOrderID;

const buttonsStyle = {
    color: "gold" as "gold" | "blue" | "silver" | "white" | "black",
    label: "paypal" as "paypal" | "checkout" | "buynow" | "pay" | "installment" | "subscribe" | "donate",
    layout: "vertical" as "vertical" | "horizontal",
    shape: "rect" as "rect" | "pill",
    tagline: false,
    // size: 'responsive', // The "size" options seems to have been replaced by "height" (responsive by default)
}

const payPalCommerceGateway: Gateway = {
    id: 'paypal-commerce',
    supportsRecurring: false,
    supportsCurrency(currency: string): boolean {
        return true;
    },
    initialize() {
        payPalDonationsSettings = this.settings;
    },
    beforeCreatePayment: async function (values): Promise<object> {
        return {
            payPalOrderId: payPalOrderID
        };
    },
    Fields() { // Can we get this.settings to be available here?
        const {useWatch} = window.givewp.form.hooks;
        const amount = useWatch({name: 'amount'});
        const firstName = useWatch({name: 'firstName'});
        const lastName = useWatch({name: 'lastName'});
        const email = useWatch({name: 'email'});

        console.log(payPalDonationsSettings.sdkOptions)

        const CUSTOM_FIELD_STYLE = { // @todo How do we ensure that this matches the form design?
            height: '50px', // @todo Magic number, but it works
            borderWidth: ".078rem",
            borderStyle: "solid",
            borderColor: "#666",
            borderRadius: ".25rem",
            padding: "1.1875rem",
            width: "100%",
            marginBottom: ".5rem",
            boxSizing: "inherit",
            inlineSize: "100%",
            backgroundColor: "#fff",
            color: "#4d4d4d",
            fontSize: "1rem",
            fontFamily: "inherit",
            fontWeight: "500",
            lineHeight: "1.2"
        };

        return (
            <fieldset className="no-fields">
                <PayPalScriptProvider options={payPalDonationsSettings.sdkOptions}>
                    <PayPalButtons
                        style={buttonsStyle}
                        forceReRender={[amount, firstName, lastName, email]}
                        createOrder={async (data, actions) => {

                            let formData = new FormData();
                            formData.append('give-amount', amount);
                            formData.append('give_first', firstName);
                            formData.append('give_last', lastName);
                            formData.append('give_email', email);
                            formData.append('give-form-id', payPalDonationsSettings.donationFormId);
                            formData.append('give-form-hash', payPalDonationsSettings.donationFormNonce);

                            // eslint-disable-next-line
                            const response = await fetch(`${payPalDonationsSettings.ajaxUrl}?action=give_paypal_commerce_create_order`, {
                                method: 'POST',
                                body: formData,
                            } );
                            const responseJson = await response.json();
                            console.log(responseJson)

                            if ( ! responseJson.success ) {
                                throw responseJson.data.error;
                            }

                            return payPalOrderID = responseJson.data.id
                        }}
                        onApprove={async (data, actions) => {
                            return actions.order.capture().then((details) => {
                                // @ts-ignore
                                document.forms[0].querySelector('[type="submit"]').click()
                            });
                        }}
                    />

                    {'---- Or pay with card ----'}

                    <PayPalHostedFieldsProvider
                        createOrder={()=> {console.log('Hosted Fields Create Order'); return 'test';}}
                        >
                        <PayPalHostedField
                            id="card-number"
                            className="givewp-fields"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="number"
                            options={{
                                selector: "#card-number",
                                placeholder: "4111 1111 1111 1111",
                            }}
                        />
                        <PayPalHostedField
                            id="cvv"
                            className="givewp-fields"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="cvv"
                            options={{
                                selector: "#cvv",
                                placeholder: "123",
                                maskInput: true,
                            }}
                        />
                        <PayPalHostedField
                            id="expiration-date"
                            className="givewp-fields"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="expirationDate"
                            options={{
                                selector: "#expiration-date",
                                placeholder: "MM/YYYY",
                            }}
                        />
                    </PayPalHostedFieldsProvider>
                </PayPalScriptProvider>
            </fieldset>
        );
    },
};

window.givewp.gateways.register(payPalCommerceGateway);
