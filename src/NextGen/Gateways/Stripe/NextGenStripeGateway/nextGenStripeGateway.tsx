import {loadStripe, Stripe, StripeElements, StripePaymentElementChangeEvent} from '@stripe/stripe-js';
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import type {Gateway, GatewaySettings} from '@givewp/forms/types';

let stripePromise = null;
let stripePaymentMethod = null;
let stripePaymentMethodIsCreditCard = false;

/**
 * Takes in an amount value in dollar units and returns the calculated cents amount
 *
 * @unreleased
 */
const dollarsToCents = (amount) => {
    return Math.round(amount * 100);
};

const StripeFields = ({gateway}) => {
    const stripe = useStripe();
    const elements = useElements();

    gateway.stripe = stripe;
    gateway.elements = elements;
    const handleOnChange = (event: StripePaymentElementChangeEvent) => {
        stripePaymentMethod = event.value.type;
        stripePaymentMethodIsCreditCard = event.value.type === 'card';
    };

    return <PaymentElement onChange={handleOnChange} />;
};

interface StripeSettings extends GatewaySettings {
    stripeKey: string;
    stripeConnectAccountId: string;
    stripeClientSecret: string;
    successUrl: string;
    stripePaymentIntentId: string;
}

interface StripeGateway extends Gateway {
    stripe?: Stripe;
    elements?: StripeElements;
    settings?: StripeSettings;
}

const stripeGateway: StripeGateway = {
    id: 'next-gen-stripe',
    initialize() {
        const {stripeKey, stripeConnectedAccountId} = this.settings;

        if (!stripeKey || !stripeConnectedAccountId) {
            throw new Error('Stripe gateway settings are missing.  Check your Stripe settings.');
        }

        /**
         * Create the Stripe object and pass our api keys
         */
        stripePromise = loadStripe(stripeKey, {
            /**
             * @see https://stripe.com/docs/payments/accept-a-payment-deferred
             */
            betas: ['elements_enable_deferred_intent_beta_1'],
            stripeAccount: stripeConnectedAccountId,
        });
    },
    beforeCreatePayment: async function (values): Promise<object> {
        if (!this.stripe || !this.elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        return {
            stripePaymentMethod,
            stripePaymentMethodIsCreditCard,
            ...this.settings,
        };
    },
    afterCreatePayment: async function (response: {
        data: {
            clientSecret: string;
            returnUrl: string;
        };
    }): Promise<void> {
        const {error} = await this.stripe.confirmPayment({
            elements: this.elements,
            clientSecret: response.data.clientSecret,
            confirmParams: {
                return_url: response.data.returnUrl,
            },
        });

        console.error(error);
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === 'card_error' || error.type === 'validation_error') {
            throw new Error(error.message);
        } else if (error) {
            throw new Error(error.message);
        }
    },
    Fields() {
        if (!stripePromise) {
            throw new Error('Stripe library was not able to load.  Check your Stripe settings.');
        }

        const {useWatch} = window.givewp.form.hooks;
        const donationType = useWatch({name: 'donationType'});
        const donationCurrency = useWatch({name: 'currency'});
        const donationAmount = useWatch({name: 'amount'});

        const stripeElementOptions = {
            mode: donationType === 'subscription' ? 'subscription' : 'payment',
            amount: dollarsToCents(donationAmount),
            currency: donationCurrency.toLowerCase(),
        };

        return (
            // @ts-ignore - we are using a beta version of elements so ignore typescript temporarily
            <Elements stripe={stripePromise} options={stripeElementOptions}>
                <StripeFields gateway={stripeGateway} />
            </Elements>
        );
    },
};

window.givewp.gateways.register(stripeGateway);
