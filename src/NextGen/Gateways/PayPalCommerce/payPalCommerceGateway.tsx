import {
    PayPalScriptProvider,
    PayPalButtons,
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
                </PayPalScriptProvider>
            </fieldset>
        );
    },
};

window.givewp.gateways.register(payPalCommerceGateway);
