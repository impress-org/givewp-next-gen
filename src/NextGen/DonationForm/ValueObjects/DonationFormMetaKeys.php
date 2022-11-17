<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;
use Give\Framework\Support\ValueObjects\EnumInteractsWithQueryBuilder;

/**
 * @unreleased
 *
 * @method static DonationFormMetaKeys SETTINGS()
 * @method bool isSettings()
 * @method static DonationFormMetaKeys FORM_EARNINGS()
 * @method static DonationFormMetaKeys DONATION_LEVELS()
 * @method static DonationFormMetaKeys SET_PRICE()
 * @method static DonationFormMetaKeys GOAL_OPTION()
 */
class DonationFormMetaKeys extends Enum
{
    use EnumInteractsWithQueryBuilder;

    const SETTINGS = 'formBuilderSettings';
}
