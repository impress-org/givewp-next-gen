<?php

use Give\Framework\Database\DB;

/**
 * This function is used to "redirect" shortcodes and blocks
 * to a migrated form ID, if one exists.
 *
 * @unreleased
 *
 * @param $formId $formId is used as an "output argument", meaning it is updated without needing to be returned.
 *
 * @return void Note: $formId is an "output argument" - not a return value.
 */
function givewp_migrated_form_id(&$formId) {
    global $wpdb;

    $formId = DB::get_var(
        DB::prepare(
            "
                    SELECT `form_id`
                    FROM `{$wpdb->prefix}give_formmeta`
                    WHERE `meta_key` = 'migratedFormId'
                      AND `meta_value` = %d",
            $formId
        )
    ) ?: $formId;
}
