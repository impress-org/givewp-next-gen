<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;
use Give\Framework\Support\ValueObjects\EnumInteractsWithQueryBuilder;

/**
 * @unlreased
 *
 * @method static DonationFormMetaKeys SETTINGS()
 */
class DonationFormMetaKeys extends Enum
{
    use EnumInteractsWithQueryBuilder;

    const SETTINGS = 'formBuilderSettings';
}
