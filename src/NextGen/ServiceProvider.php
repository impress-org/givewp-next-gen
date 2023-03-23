<?php

namespace Give\NextGen;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\Exceptions\OverflowException;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Helpers\Hooks;
use Give\NextGen\DonationForm\FormDesigns\ClassicFormDesign\ClassicFormDesign;
use Give\NextGen\DonationForm\FormDesigns\DeveloperFormDesign\DeveloperFormDesign;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\Framework\FormDesigns\Registrars\FormDesignRegistrar;
use Give\NextGen\Gateways\NextGenTestGateway\NextGenTestGateway;
use Give\NextGen\Gateways\NextGenTestGatewayOffsite\NextGenTestGatewayOffsite;
use Give\NextGen\Gateways\PayPal\PayPalStandardGateway\PayPalStandardGateway;
use Give\NextGen\Gateways\Stripe\LegacyStripeAdapter;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGatewaySubscriptionModule;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\ChargeRefunded;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\CustomerSubscriptionCreated;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\CustomerSubscriptionDeleted;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\InvoicePaymentFailed;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\InvoicePaymentSucceeded;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\PaymentIntentPaymentFailed;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\Webhooks\Listeners\PaymentIntentSucceeded;
use Give\PaymentGateways\Gateways\PayPalStandard\PayPalStandard;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @since 0.1.0
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @since 0.1.0
     */
    public function register()
    {
        give()->singleton('forms', DonationFormRepository::class);
    }

    /**
     * @since 0.1.0
     *
     * @throws Exception
     */
    public function boot()
    {
        $this->registerGateways();
        $this->registerFormDesigns();
    }

    /**
     * @since 0.1.0
     *
     * @throws Exception
     * @throws OverflowException
     */
    private function registerGateways()
    {
        add_action('givewp_register_payment_gateway', static function (PaymentGatewayRegister $registrar) {
            $registrar->registerGateway(NextGenTestGateway::class);
            $registrar->registerGateway(NextGenStripeGateway::class);
            $registrar->registerGateway(NextGenTestGatewayOffsite::class);
            $registrar->unregisterGateway(PayPalStandard::id());
            $registrar->registerGateway(PayPalStandardGateway::class);
        });

        /**
         * This module will eventually live in give-recurring
         */
        if (defined('GIVE_RECURRING_VERSION') && GIVE_RECURRING_VERSION) {
            add_filter(
                sprintf("givewp_gateway_%s_subscription_module", NextGenStripeGateway::id()),
                static function () {
                    return NextGenStripeGatewaySubscriptionModule::class;
                }
            );
        }

        give(LegacyStripeAdapter::class)->addDonationDetails();

        $this->addStripeWebhookListeners();
    }

    /**
     * @since 0.1.0
     * @throws Framework\FormDesigns\Exceptions\OverflowException
     */
    private function registerFormDesigns()
    {
        add_action('givewp_register_form_design', static function (FormDesignRegistrar $formDesignRegistrar) {
            $formDesignRegistrar->registerDesign(ClassicFormDesign::class);
            $formDesignRegistrar->registerDesign(DeveloperFormDesign::class);
        });
    }

    /**
     * @unreleased
     */
    private function addStripeWebhookListeners()
    {
//        Hooks::addAction(
//            'give_recurring_stripe_process_invoice_payment_succeeded',
//            InvoicePaymentSucceeded::class
//        );

        Hooks::addAction(
            'give_stripe_processing_payment_intent_succeeded',
            PaymentIntentSucceeded::class
        );

        Hooks::addAction(
            'give_stripe_processing_payment_intent_failed',
            PaymentIntentPaymentFailed::class
        );

        Hooks::addAction(
            'give_stripe_processing_charge_refunded',
            ChargeRefunded::class
        );

        Hooks::addAction(
            'give_recurring_stripe_processing_invoice_payment_succeeded',
            InvoicePaymentSucceeded::class
        );

        Hooks::addAction(
            'give_recurring_stripe_processing_invoice_payment_failed',
            InvoicePaymentFailed::class
        );

        Hooks::addAction(
            'give_recurring_stripe_processing_customer_subscription_created',
            CustomerSubscriptionCreated::class
        );

        Hooks::addAction(
            'give_recurring_stripe_processing_customer_subscription_deleted',
            CustomerSubscriptionDeleted::class
        );
    }
}
