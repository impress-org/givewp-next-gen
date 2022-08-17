<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class PaymentGateways extends Field
{
    const TYPE = 'gateways';

    public function getNodeType(): string
    {
        return 'layout';
    }
}
