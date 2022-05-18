<?php

namespace Give\NextGen\Gateways\Stripe\NextGenCreditCardGateway;

use Give\Framework\EnqueueScript;
use Give\PaymentGateways\Gateways\Stripe\CreditCardGateway;

/**
 * @unreleased
 */
class NextGenCreditCardGateway extends CreditCardGateway
{
    /**
     * @inheritDoc
     */
    public static function id(): string
    {
        return 'next-gen-stripe';
    }

     /**
     * @inheritDoc
     */
    public function getId(): string
    {
        return self::id();
    }

    /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return __('Next Gen Stripe - Credit Card', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Next Gen Stripe - Credit Card', 'give');
    }

     /**
     * @unreleased
     *
     * @return EnqueueScript
     */
    public function enqueueScript(): EnqueueScript
    {
        return new EnqueueScript(
            $this->getId(),
            'src/NextGen/Gateways/Stripe/NextGenCreditCardGateway/build.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
    }
}
