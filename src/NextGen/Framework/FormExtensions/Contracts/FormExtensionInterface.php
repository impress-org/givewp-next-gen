<?php

namespace Give\NextGen\Framework\FormExtensions\Contracts;

/**
 * The structure of a GiveWP FormExtension
 *
 * @unreleased
 */
interface FormExtensionInterface
{
    /**
     * Return a unique identifier for the extension
     *
     * @unreleased
     */
    public static function id(): string;

    /**
     * Returns a human-readable name for the extension
     *
     * @unreleased
     */
    public static function name(): string;
}
