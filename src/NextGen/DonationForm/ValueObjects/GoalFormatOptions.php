<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;

/**
 * @unlreased
 *
 * @method static RegistrationOptions AMOUNT_RAISED()
 * @method static RegistrationOptions PERCENTAGE_RAISED()
 * @method static RegistrationOptions NUMBER_DONATIONS()
 * @method static RegistrationOptions NUMBER_DONORS()
 */
class GoalFormatOptions extends Enum
{
    const AMOUNT_RAISED = 'amount-raised';
    const PERCENTAGE_RAISED = 'percentage-raised';
    const NUMBER_DONATIONS = 'number-donations';
    const NUMBER_DONORS = 'number-donors';
}
