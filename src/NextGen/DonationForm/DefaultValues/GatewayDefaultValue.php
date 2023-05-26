<?php

namespace Give\NextGen\DonationForm\DefaultValues;

use Give\Framework\PaymentGateways\PaymentGatewayRegister;

class GatewayDefaultValue
{
    public function __invoke(): string
    {
        /** @var PaymentGatewayRegister $paymentGatewayRegistrar */
        $paymentGatewayRegistrar = give(PaymentGatewayRegister::class);

        // get all the supported gateway ids
        $gatewayIds = array_keys($paymentGatewayRegistrar->getNextGenPaymentGateways());

        $defaultGateway = give_get_option( 'default_gateway' );

        return in_array($defaultGateway, $gatewayIds, true) ? $defaultGateway : current($gatewayIds);
    }
}
