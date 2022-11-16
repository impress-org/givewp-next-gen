<?php

namespace Give\NextGen\DonationForm\DataTransferObjects;

use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 */
class DonationFormViewRouteData
{
    /**
     * @var int
     */
    public $formId;

    /**
     * @var BlockCollection|null
     */
    public $formBlocks;

    /**
     * @var array
     */
    public $formSettings;

    /**
     * Convert data from request into DTO
     *
     * @unreleased
     */
    public static function fromRequest(array $request): DonationFormViewRouteData
    {
        $self = new static();

        $self->formId = (int)$request['form-id'];
        $self->formSettings = !empty($request['form-settings']) ? $self->filterFormSettings(
            $request['form-settings']
        ) : [];
        $self->formBlocks = !empty($request['form-blocks']) ? BlockCollection::fromJson(
            $request['form-blocks']
        ) : null;

        return $self;
    }

    /**
     * The route is receiving boolean params as strings.
     * This is a temporary hot fix to find those values and cast them to booleans.
     * I'm sure there is a better way to do this.
     *
     * @unreleased
     */
    public function filterFormSettings(array $settings): array
    {
        return array_map(static function ($setting) {
            if ($setting === 'false') {
                return false;
            }

            if (filter_var($setting, FILTER_VALIDATE_BOOLEAN)) {
                return (bool)$setting;
            }

            return $setting;
        }, $settings);
    }
}
