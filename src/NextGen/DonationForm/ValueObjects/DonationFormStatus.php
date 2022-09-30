<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;

/**
 * @unreleased
 *
 * @method static DonationFormStatus PUBLISHED()
 * @method static DonationFormStatus FUTURE()
 * @method static DonationFormStatus DRAFT()
 * @method static DonationFormStatus PENDING()
 * @method static DonationFormStatus TRASH()
 * @method bool isPublished()
 * @method bool isFuture()
 * @method bool isDraft()
 * @method bool isPending()
 * @method bool isTrash()
 */
class DonationFormStatus extends Enum
{
    const PUBLISHED = 'publish';
    const FUTURE = 'future';
    const DRAFT = 'draft';
    const PENDING = 'pending';
    const TRASH = 'trash';
}
