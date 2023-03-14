<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

class StripeGatewayData {
    /**
     * @var string
     */
    public $stripeConnectedAccountId;
    /**
     * @var string
     */
    public $stripePaymentIntentId;
    /**
     * @var string
     */
    public $successUrl;

    /**
     * @param  array{stripeConnectedAccountKey: string, stripePaymentIntentId: string}  $request
     * @return StripeGatewayData
     */
    public static function fromRequest(array $request): StripeGatewayData
    {
        $self = new self();
        $self->stripeConnectedAccountId = $request['stripeConnectedAccountId'];
        $self->stripePaymentIntentId = $request['stripePaymentIntentId'];
        $self->successUrl = rawurldecode($request['successUrl']);

        return $self;
    }
}