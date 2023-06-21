<?php
namespace Give\Framework\PaymentGateways\Contracts;

/**
 * @since 0.1.0
 */
interface NextGenPaymentGatewayInterface
{

    /**
     * @since 0.1.0
     */
    public function supportsLegacyForm(): bool;

    /**
     * @since 0.1.0
     */
    public function enqueueScript();

    /**
     * @since 0.1.0
     */
    public function formSettings(int $formId): array;
}
