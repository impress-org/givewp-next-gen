<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;

/**
 * @unreleased
 *
 * @method static DonationFormStatus PUBLISH()
 * @method static DonationFormStatus FUTURE()
 * @method static DonationFormStatus DRAFT()
 * @method static DonationFormStatus PENDING()
 * @method static DonationFormStatus TRASH()
 */
class DonationFormStatus extends Enum
{
    const PUBLISH = 'publish';
    const FUTURE = 'future';
    const DRAFT = 'draft';
    const PENDING = 'pending';
    const TRASH = 'trash';
}
