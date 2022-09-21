<?php

namespace Give\NextGen\DonationForm\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;

/**
 * @unreleased
 *
 * @method static RegistrationOptions NONE()
 * @method static RegistrationOptions REGISTRATION()
 * @method static RegistrationOptions LOGIN()
 * @method static RegistrationOptions REGISTRATION_LOGIN()
 */
class RegistrationOptions extends Enum
{
    const NONE = 'none';
    const REGISTRATION = 'registration';
    const LOGIN = 'login';
    const REGISTRATION_LOGIN = 'register_and_login';
}
