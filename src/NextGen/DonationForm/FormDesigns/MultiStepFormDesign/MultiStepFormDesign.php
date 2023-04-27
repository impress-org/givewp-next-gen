<?php

namespace Give\NextGen\DonationForm\FormDesigns\MultiStepFormDesign;

use Give\NextGen\Framework\FormDesigns\FormDesign;

/**
 * @unreleased
 */
class MultiStepFormDesign extends FormDesign
{
    protected $isMultiStep = true;

    /**
     * @unreleased
     */
    public static function id(): string
    {
        return 'multi-step';
    }

    /**
     * @unreleased
     */
    public static function name(): string
    {
        return __('Multi-Step', 'give');
    }
}
