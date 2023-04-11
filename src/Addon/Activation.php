<?php

namespace Give\Addon;

use Give\Addon\Actions\AutoActivateLicense;
use Give\NextGen\Gateways\NextGenTestGateway\NextGenTestGateway;

/**
 * Example of a helper class responsible for registering and handling add-on activation hooks.
 *
 * @package     Give\Addon
 * @copyright   Copyright (c) 2020, GiveWP
 */
class Activation
{
    /**
     * Activate add-on action hook.
     *
     * @since 0.3.0 enable the NextGenTestGateway gateway by default
     * @since 0.1.0
     * @return void
     */
    public static function activateAddon()
    {
        if (!Environment::isGiveActive()) {
            return;
        }

        $gateways = give_get_option('gateways');

        if (!array_key_exists(NextGenTestGateway::id(), $gateways)) {
            $gateways[NextGenTestGateway::id()] = "1";

            give_update_option('gateways', $gateways);
        }

        give(AutoActivateLicense::class)->__invoke(
            '1591640',
            'b260dd6fad0544b593f4af16734da32b'
        );
    }

    /**
     * Deactivate add-on action hook.
     *
     * @since 0.1.0
     * @return void
     */
    public static function deactivateAddon()
    {
    }

    /**
     * Uninstall add-on action hook.
     *
     * @since 0.1.0
     * @return void
     */
    public static function uninstallAddon()
    {
    }
}
