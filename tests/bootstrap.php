<?php
if (file_exists(__DIR__ . '/../../give/vendor/wordpress/wordpress/tests/phpunit/includes/functions.php')) {
    require_once __DIR__ . '/../../give/vendor/wordpress/wordpress/tests/phpunit/includes/functions.php';
} elseif (file_exists('/tmp/wordpress-tests-lib/includes/functions.php')) {
    require_once '/tmp/wordpress-tests-lib/includes/functions.php';
}

tests_add_filter('muplugins_loaded', function () {
    require_once __DIR__ . '/../give-next-gen.php';
});

require_once __DIR__ . '/../../give/tests/unit/bootstrap.php';

//tests_add_filter('muplugins_loaded', static function() {
//    require_once __DIR__ . "/../../give/give.php";
//});

//require_once __DIR__ . "/../give-next-gen.php";
//require_once __DIR__ . "/../vendor/autoload.php";
//require_once __DIR__ . "/../../../../wp-load.php";
