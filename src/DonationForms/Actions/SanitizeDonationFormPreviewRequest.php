<?php

namespace Give\DonationForms\Actions;

class SanitizeDonationFormPreviewRequest
{
    /**
     * @unreleased
     */
    public function __invoke($var)
    {
        if (is_array($var)) {
            return array_map($this, $var);
        } else {
            return is_scalar($var) ? wp_kses_post(wp_unslash($var)) : $var;
        }
    }
}
