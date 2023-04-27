<?php

namespace Give\NextGen\Framework\FormExtensions;

use Give\NextGen\Framework\FormExtensions\Contracts\FormExtensionInterface;

/**
 * The FormExtension is meant to be extended to create custom GiveWP form extensions.
 *
 * @unreleased
 */
abstract class FormExtension implements FormExtensionInterface
{
    /**
     * The unique identifier of the extension
     *
     * @unreleased
     */
    abstract public static function id(): string;

    /**
     * THe human-readable name of the extension
     *
     * @unreleased
     */
    abstract public static function name(): string;

    /**
     * Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
     *
     * @unreleased
     *
     * @return string|false
     */
    public function formBuilderCss()
    {
        return false;
    }

    /**
     * Full URL of the script, or path of the script relative to the WordPress root directory.
     *
     * @unreleased
     *
     * @return string|false
     */
    public function formBuilderJs()
    {
        return false;
    }

    /**
     * An array of dependencies compatible with the `$deps` parameter in wp_enqueue_script
     *
     * @see https://developer.wordpress.org/reference/functions/wp_enqueue_script/
     * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/#wordpress
     *
     * @return array
     */
    public function formBuilderDependencies(): array
    {
        return [];
    }

    /**
     * Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
     *
     * @unreleased
     *
     * @return string|false
     */
    public function formViewCss()
    {
        return false;
    }

    /**
     * Full URL of the script, or path of the script relative to the WordPress root directory.
     *
     * @unreleased
     *
     * @return string|false
     */
    public function formViewJs()
    {
        return false;
    }

    /**
     * An array of dependencies compatible with the `$deps` parameter in wp_enqueue_script
     *
     * @see https://developer.wordpress.org/reference/functions/wp_enqueue_script/
     * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/#wordpress
     *
     * @return array
     */
    public function formViewDependencies(): array
    {
        return [];
    }
}
