import {loadStripe} from '@stripe/stripe-js';
import {Elements, PaymentElement} from "@stripe/react-stripe-js";
import getWindowData from "../utilities/getWindowData";
import Gateway from "../types/Gateway";

/**
 * Get data from the server
 */
const {stripeKey, stripeConnectAccountId, stripeClientSecret} = getWindowData();

/**
 * Create the Stripe object and pass our api keys
 */
const stripePromise = loadStripe(stripeKey, {
    stripeAccount: stripeConnectAccountId,
});

const stripeElementOptions = {
    clientSecret: stripeClientSecret,
};

const stripeGateway: Gateway = {
    id: 'stripe',
    label: 'Stripe',
    createPayment(values) {
        window.alert('create payment with gateway');

        return true;
    },
    fields() {
        return (
            <Elements stripe={stripePromise} options={stripeElementOptions}>
                <PaymentElement/>
            </Elements>
        )
    }
}

export default stripeGateway;
