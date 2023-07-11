<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class PaymentGateways extends Field {

    /**
     * @unreleased
     *
     * @type bool
     */
    public $isTestMode;

    /**
     * @unreleased
     */
    public function setTestMode( bool $testMode ): PaymentGateways {
        $this->isTestMode = $testMode;

        return $this;
    }

    const TYPE = 'gateways';
}
