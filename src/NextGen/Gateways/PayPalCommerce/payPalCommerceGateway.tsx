import {
    PayPalButtons,
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    usePayPalHostedFields,
} from "@paypal/react-paypal-js";
import type {Gateway} from '@givewp/forms/types';
import {__} from "@wordpress/i18n";
import {debounce} from "react-ace/lib/editorOptions";
import {Flex} from "@wordpress/components";

let amount;
let firstName;
let lastName;
let email;
let hostedField;
let payPalDonationsSettings;
let payPalOrderId;

const buttonsStyle = {
    color: "gold" as "gold" | "blue" | "silver" | "white" | "black",
    label: "paypal" as "paypal" | "checkout" | "buynow" | "pay" | "installment" | "subscribe" | "donate",
    layout: "vertical" as "vertical" | "horizontal",
    shape: "rect" as "rect" | "pill",
    tagline: false,
    // size: 'responsive', // The "size" options seems to have been replaced by "height" (responsive by default)
}

const CUSTOM_FIELD_STYLE = { // @todo How do we ensure that this matches the form design?
    height: '50px', // @todo Magic number, but it works
    borderWidth: ".078rem",
    borderStyle: "solid",
    borderColor: "#666",
    borderRadius: ".25rem",
    padding: "0 1.1875rem",
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

const getFormData = () => {
    const formData = new FormData();
    formData.append('give-amount', amount);
    formData.append('give_first', firstName);
    formData.append('give_last', lastName);
    formData.append('give_email', email);
    formData.append('give-form-id', payPalDonationsSettings.donationFormId);
    formData.append('give-form-hash', payPalDonationsSettings.donationFormNonce);
    return formData;
}

const validateHostedFields = () => {
    return Object.values(
        hostedField.cardFields.getState().fields
    ).some((field) => field.isValid)
}

const createOrderHandler = async (data, actions) => {

    const response = await fetch(`${payPalDonationsSettings.ajaxUrl}?action=give_paypal_commerce_create_order`, {
        method: 'POST',
        body: getFormData(),
    } );
    const responseJson = await response.json();

    if ( ! responseJson.success ) {
        throw responseJson.data.error;
    }

    return payPalOrderId = responseJson.data.id
}

const Divider = ({label, style = {}}) => {

    const styles = {
        container: {
            fontSize: '16px',
            fontStyle: 'italic',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
        },
        dashedLine: {
            border: '1px solid #d4d4d4',
            flexGrow: 1,
        },
        label: {
            padding: '0 6px',
            fontSize: '14px',
            color: '#8d8e8e',
        },
    }

    return (
        <div className="separator-with-text" style={styles.container}>
            <div className="dashed-line" style={styles.dashedLine} />
            <div className="label" style={styles.label}>
                {label}
            </div>
            <div className="dashed-line" style={styles.dashedLine} />
        </div>
    )
}

const HoistHostedFieldContext = () => {
    hostedField = usePayPalHostedFields();
    return <></>
}

const FormFieldsProvider = ({children}) => {
    const {useWatch} = window.givewp.form.hooks;
    amount = useWatch({name: 'amount'});
    firstName = useWatch({name: 'firstName'});
    lastName = useWatch({name: 'lastName'});
    email = useWatch({name: 'email'});

    return children;
}

const SmartButtonsContainer = () => {
    return (
        <PayPalButtons
            style={buttonsStyle}
            // @ts-ignore
            forceReRender={debounce(() => [amount, firstName, lastName, email], 500)}
            createOrder={createOrderHandler}
            onApprove={async (data, actions) => {
                return actions.order.capture().then((details) => {
                    // @ts-ignore
                    document.forms[0].querySelector('[type="submit"]').click()
                });
            }}
        />
    )
}

const HostedFieldsContainer = () => {
    return (
        <PayPalHostedFieldsProvider
            notEligibleError={<div>Your account is not eligible</div>}
            createOrder={createOrderHandler}
        >

            <Divider label={__('Or pay with card', 'give')} style={{padding: '30px 0'}} />

            <PayPalHostedField
                id="card-number"
                className="card-field"
                style={CUSTOM_FIELD_STYLE}
                hostedFieldType="number"
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />

            <Flex gap="10px">
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
                <PayPalHostedField
                    id="cvv"
                    className="card-field"
                    style={CUSTOM_FIELD_STYLE}
                    hostedFieldType="cvv"
                    options={{
                        selector: "#cvv",
                        placeholder: "123",
                        maskInput: true,
                    }}
                />
            </Flex>
            <div style={{display: "flex", gap: '10px'}}>

            </div>

            <HoistHostedFieldContext />
        </PayPalHostedFieldsProvider>
    )
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

        if(payPalOrderId) { // If order ID already set by payment buttons then return early.
            return {
                payPalOrderId: payPalOrderId
            };
        }

        if(!validateHostedFields()) {
            throw new Error('Invalid hosted fields');
        }

        return hostedField.cardFields
            .submit({cardholderName: 'Tester T. Test',})
            .then(async (data) => {
                await fetch( `${payPalDonationsSettings.ajaxUrl}?action=give_paypal_commerce_approve_order&order=` + data.orderId, {
                    method: 'POST',
                    body: getFormData(),
                } );
                return {...data, payPalOrderId: data.orderId}
            })
            .catch((err) => {
                console.log('paypal commerce error', err)
                throw new Error('paypal commerce error');
            });
    },
    Fields() { // Can we get this.settings to be available here?
        return (
            <FormFieldsProvider>
                <PayPalScriptProvider options={payPalDonationsSettings.sdkOptions}>
                    <SmartButtonsContainer />
                    <HostedFieldsContainer />
                </PayPalScriptProvider>
            </FormFieldsProvider>
        );
    },
};

window.givewp.gateways.register(payPalCommerceGateway);
