<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

class PaymentGateways extends Field
{
    public function getNodeType(): string
    {
        return 'layout';
    }

    public function getType(): string
    {
        return 'gateways';
    }
}
