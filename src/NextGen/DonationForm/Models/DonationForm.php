<?php

namespace Give\NextGen\DonationForm\Models;

use Give\Framework\FieldsAPI\Form;
use Give\Framework\Models\Contracts\ModelCrud;
use Give\Framework\Models\Model;
use Give\NextGen\DonationForm\Traits\DonationFormCRUD;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;

/**
 * @unreleased
 *
 * @property int $id
 */
class DonationForm extends Model implements ModelCrud
{
    use DonationFormCRUD;

    /**
     * @inheritdoc
     */
    protected $properties = [
        'id' => 'int',
        'formTitle' => 'string',
        'status' => DonationFormStatus::class,
        'schema' => Form::class,
        'settings' => 'array',
    ];

    public function getSetting( $settingName )
    {
        return $this->settings[$settingName];
    }

    /**
     * @unreleased
     *
     * @inheritDoc
     */
    protected function getPropertyDefaults(): array
    {
        return array_merge(parent::getPropertyDefaults(), [
            //
        ]);
    }
}
