<?php

declare(strict_types=1);

namespace Give\Framework\FieldsAPI;

/**
 * @unreleased
 */
class Password extends Field
{
    use Concerns\HasHelpText;
    use Concerns\HasLabel;
    use Concerns\HasPlaceholder;

    const TYPE = 'password';

    public function shouldStoreAsDonorMeta()
    {
        return false;
    }
}
