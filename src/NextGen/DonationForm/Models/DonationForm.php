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
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 *
 * @property int $id
 * @property string $formTitle
 * @property DateTime $createdAt
 * @property DateTime $updatedAt
 * @property DonationFormStatus $status
 * @property Form $schema
 * @property array $settings
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
        'blocksData' => BlockCollection::class,
        'settings' => 'array',
    ];

    /**
     * @unreleased
     *
     * @param string $settingName
     *
     * @return mixed
     */
    public function getSetting( $settingName )
    {
        return $this->settings[$settingName];
    }

    /**
     * @unreleased
     *
     * @param $name
     * @param $value
     *
     * @return $this
     */
    public function updateSetting($name, $value): self
    {
        $this->settings = array_merge($this->settings, [
            'foo' => 'bar',
        ]);
        return $this;
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

    /**
     * @unreleased
     * @return DonationFormFactory
     */
    public static function factory(): DonationFormFactory
    {
        return new DonationFormFactory(static::class);
    }
}
