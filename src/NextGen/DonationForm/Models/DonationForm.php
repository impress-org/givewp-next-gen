<?php

namespace Give\NextGen\DonationForm\Models;

use DateTime;
use Give\Framework\FieldsAPI\Form;
use Give\Framework\Models\Contracts\ModelCrud;
use Give\Framework\Models\Contracts\ModelHasFactory;
use Give\Framework\Models\Model;
use Give\NextGen\DonationForm\Factories\DonationFormFactory;
use Give\NextGen\DonationForm\Traits\DonationFormCRUD;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;

/**
 * @unreleased
 *
 * @property int $id
 */
class DonationForm extends Model implements ModelCrud, ModelHasFactory
{
    use DonationFormCRUD;

    /**
     * @inheritdoc
     */
    protected $properties = [
        'id' => 'int',
        'formTitle' => 'string',
        'createdAt' => DateTime::class,
        'updatedAt' => DateTime::class,
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

    public static function factory(): DonationFormFactory
    {
        return new DonationFormFactory(static::class);
    }
}
