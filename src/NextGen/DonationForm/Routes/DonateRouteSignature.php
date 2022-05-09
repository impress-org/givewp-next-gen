<?php

namespace Give\NextGen\DonationForm\Routes;

/**

 * @unreleased
 */
class DonateRouteSignature
{
    /**
     * @var string
     */
    private $signature;
    /**
     * @var string
     */
    public $expiration;

    /**
     * @unreleased
     */
    public function __construct(string $name, string $expiration = null)
    {
        $this->expiration = $expiration ?: $this->createExpirationTimestamp();
        $this->signature = $this->generateSignatureString($name, $this->expiration);
    }


    /**
     * @unreleased
     */
    private function generateSignatureString(string $name, string $expiration): string
    {
        return "$name|$expiration";
    }

    /**
     * @unreleased
     *
     * @return string
     */
    public function toString(): string
    {
        return $this->signature;
    }

    /**
     * @unreleased
     *
     * @return string
     */
    public function toHash(): string
    {
        return wp_hash($this->signature);
    }

    /**
     * Create expiration timestamp
     *
     * @unreleased
     *
     * @return string
     */
    public function createExpirationTimestamp(): string
    {
        return (string)current_datetime()->modify('+1 day')->getTimestamp();
    }


    /**
     * @unreleased
     */
    public function isValid(string $suppliedSignature): bool
    {
        $isSignatureValid = hash_equals(
            $suppliedSignature,
            $this->toHash()
        );

        $isNotExpired = ((int)$this->expiration) >= current_datetime()->getTimestamp();

        return $isSignatureValid && $isNotExpired;
    }
}
