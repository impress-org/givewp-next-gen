<?php

namespace TestsNextGen;

/**
 * @unreleased
 *
 * TODO: move into GiveWP Core
 *
 */
class TestHooks
{

    /**
     * @unreleased
     *
     * @return void
     */
    public static function loadPlugin(string $pathToPluginFile)
    {
        self::addFilter('muplugins_loaded', static function () use ($pathToPluginFile) {
            require_once $pathToPluginFile;
        });
    }

    /**
     * @unreleased
     */
    public static function addFilter(string $tag, \Closure $function_to_add, int $priority = 10, int $accepted_args = 1): bool
    {
        global $wp_filter;

        if (function_exists('add_filter')) {
            add_filter($tag, $function_to_add, $priority, $accepted_args);
        } else {
            $idx = self::buildUniqueIdFromFunction($function_to_add);

            $wp_filter[$tag][$priority][$idx] = array(
                'function' => $function_to_add,
                'accepted_args' => $accepted_args,
            );
        }

        return true;
    }


    /**
     * @unreleased
     *
     * @param $function
     * @return string|void
     */
    protected static function buildUniqueIdFromFunction($function)
    {
        if (is_string($function)) {
            return $function;
        }

        if (is_object($function)) {
            // Closures are currently implemented as objects.
            $function = array($function, '');
        } else {
            $function = (array)$function;
        }

        if (is_object($function[0])) {
            // Object class calling.
            return spl_object_hash($function[0]) . $function[1];
        }

        if (is_string($function[0])) {
            // Static calling.
            return $function[0] . '::' . $function[1];
        }
    }
}
