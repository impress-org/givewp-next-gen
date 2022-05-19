/** @constant NextGenCreditCardGateway */
import {loadStripe} from '@stripe/stripe-js';
import {Elements, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";

/**
 * Get data from the server
 */
const {stripeKey, stripeConnectAccountId, stripeClientSecret, successUrl} = window.giveNextGenExports;

/**
 * Create the Stripe object and pass our api keys
 */
const stripePromise = loadStripe(stripeKey, {
    stripeAccount: stripeConnectAccountId,
});

const stripeElementOptions = {
    clientSecret: stripeClientSecret,
};

const StripeFields = ({gateway}) => {
    const stripe = useStripe();
    const elements = useElements();

    gateway.stripe = stripe;
    gateway.elements = elements;

    return <PaymentElement/>
}

const stripeGateway = {
    createPayment: async function (values) {
        window.alert('create payment with gateway');

        if (!this.stripe || !this.elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const {error} = await this.stripe.confirmPayment({
            elements: this.elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: successUrl
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            console.log(error.message);
        } else {
            console.log("An unexpected error occured.");
        }
    },
    fields() {
        return (
            <Elements stripe={stripePromise} options={stripeElementOptions}>
                <StripeFields gateway={stripeGateway}/>
            </Elements>
        )
    }
}

window.givewp.gateways.register(NextGenCreditCardGateway, stripeGateway);
