<?php

namespace Give\NextGen;

use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\Gateways\NextGenTestGateway\NextGenTestGateway;
use Give\NextGen\Gateways\Stripe\NextGenCreditCardGateway\NextGenCreditCardGateway;
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
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        add_action('give_register_payment_gateway', function (PaymentGatewayRegister $registrar) {
            $registrar->registerGateway(NextGenTestGateway::class);
            $registrar->registerGateway(NextGenCreditCardGateway::class);
        });
    }
}
