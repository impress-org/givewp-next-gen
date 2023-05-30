<?php
namespace Give\NextGen\DonationForm\Rules;

use Closure;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\Vendors\StellarWP\Validation\Contracts\ValidatesOnFrontEnd;
use Give\Vendors\StellarWP\Validation\Contracts\ValidationRule;

class GatewayRule implements ValidationRule, ValidatesOnFrontEnd
{

    /**
     * @unreleased
     */
    public static function id(): string
    {
        return 'gatewayId';
    }

    /**
     * @unreleased
     */
    public static function fromString(string $options = null): ValidationRule
    {
        return new self();
    }

    /**
     * @unreleased
     */
    public function __invoke($value, Closure $fail, string $key, array $values)
    {
        $supportedGateways = give(DonationFormRepository::class)->getEnabledPaymentGateways($values['formId']);

        // get all the supported gateway ids
        $gatewayIds = array_keys($paymentGatewayRegistrar->getNextGenPaymentGateways());

        if (!in_array($value, $gatewayIds, true)) {
            $fail(
                sprintf(
                    __('%s must be a valid gateway.  Valid gateways are: %s', 'give'),
                    '{field}',
                    implode(
                        ', ',
                        $gatewayIds
                    )
                )
            );
        }
    }

    /**
     * @unreleased
     */
    public function serializeOption()
    {
        return null;
    }
}
