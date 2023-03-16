<?php

namespace Give\NextGen;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\Exceptions\OverflowException;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
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

        /**
         * @unreleased
         */
        give(LegacyStripeAdapter::class)->addDonationDetails();
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
}
