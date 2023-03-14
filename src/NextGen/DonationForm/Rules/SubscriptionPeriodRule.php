<?php
namespace Give\NextGen\DonationForm\Rules;

use Closure;
use Give\Donations\ValueObjects\DonationType;
use Give\Subscriptions\ValueObjects\SubscriptionPeriod;
use Give\Vendors\StellarWP\Validation\Contracts\Sanitizer;
use Give\Vendors\StellarWP\Validation\Contracts\ValidatesOnFrontEnd;
use Give\Vendors\StellarWP\Validation\Contracts\ValidationRule;

class SubscriptionPeriodRule implements ValidationRule, ValidatesOnFrontEnd, Sanitizer
{

    /**
     * @since 0.2.0
     */
    public static function id(): string
    {
        return 'subscriptionPeriod';
    }

    /**
     * @since 0.2.0
     */
    public static function fromString(string $options = null): ValidationRule
    {
        return new self();
    }

    /**
     * @since 0.2.0
     */
    public function __invoke($value, Closure $fail, string $key, array $values)
    {
        $periods = array_values(SubscriptionPeriod::toArray());
        $donationType = new DonationType($values['donationType']);

        if ($donationType->isSubscription() && !in_array($value, $periods, true)) {
            $fail(
                sprintf(
                    __('%s must be a valid subscription period.  Valid periods are: %s', 'give'),
                    '{value}',
                    implode(
                        ', ',
                        $periods
                    )
                )
            );
        }
    }

    /**
     * @unreleased
     * @return SubscriptionPeriod|null
     */
    public function sanitize($value)
    {
        return $value ? new SubscriptionPeriod($value) : null;
    }

    /**
     * @unreleased
     */
    public function serializeOption()
    {
        // TODO: Implement serializeOption() method.
    }
}