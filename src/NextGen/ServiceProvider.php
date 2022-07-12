<?php

namespace Give\NextGen;

use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\Framework\FormTemplates\Actions\RegisterFormTemplates;
use Give\NextGen\Framework\FormTemplates\Registrars\FormTemplateRegistrar;
use Give\NextGen\Gateways\NextGenTestGateway\NextGenTestGateway;
use Give\NextGen\Gateways\Stripe\NextGenStripeGateway\NextGenStripeGateway;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @unreleased
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
        give()->singleton(FormTemplateRegistrar::class);
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function boot()
    {
        add_action('givewp_register_payment_gateway', function (PaymentGatewayRegister $registrar) {
            $registrar->registerGateway(NextGenTestGateway::class);
            $registrar->registerGateway(NextGenStripeGateway::class);
        });

        $this->registerFormTemplates();
    }

    /**
     * @unreleased
     * @throws Exception
     */
    private function registerFormTemplates()
    {
        (new RegisterFormTemplates())();
    }
}
