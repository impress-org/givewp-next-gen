<?php
namespace Give\NextGen\DonationForm\Rules;


use function is_numeric;

class Size extends \Give\Vendors\StellarWP\Validation\Rules\Size {
    /**
     * @unreleased
     */
    public function sanitize($value)
    {
        if (is_numeric($value)) {
            if (strpos($value, '.') !== false) {
                return (float)$value;
            }

            return (int)$value;
        }

        return $value;
    }
}