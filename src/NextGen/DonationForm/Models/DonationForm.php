<?php

namespace Give\NextGen\DonationForm\Models;

use DateTime;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Framework\FieldsAPI\Form;
use Give\Framework\Models\Contracts\ModelCrud;
use Give\Framework\Models\Contracts\ModelHasFactory;
use Give\Framework\Models\Model;
use Give\Framework\Models\ModelQueryBuilder;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormQueryData;
use Give\NextGen\DonationForm\Factories\DonationFormFactory;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 *
 * @property int $id
 * @property string $title
 * @property DateTime $createdAt
 * @property DateTime $updatedAt
 * @property DonationFormStatus $status
 * @property array $settings
 * @property BlockCollection $blockCollection
 * @property Form $schema
 */
class DonationForm extends Model implements ModelCrud, ModelHasFactory
{
    /**
     * @inheritdoc
     */
    protected $properties = [
        'id' => 'int',
        'title' => 'string',
        'createdAt' => DateTime::class,
        'updatedAt' => DateTime::class,
        'status' => DonationFormStatus::class,
        'settings' => 'array',
        'blockCollection' => BlockCollection::class,
        'schema' => Form::class, // Read-only
    ];

    /**
     * @unreleased
     * @return DonationFormFactory
     */
    public static function factory(): DonationFormFactory
    {
        return new DonationFormFactory(static::class);
    }

    /**
     * Find donation form by ID
     *
     * @unreleased
     *
     * @param int $id
     *
     * @return DonationForm|null
     */
    public static function find($id)
    {
        return give(DonationFormRepository::class)->getById($id);
    }

    /**
     * @unreleased
     *
     * @param array $attributes
     *
     * @return DonationForm
     */
    public static function create(array $attributes): DonationForm
    {
        $donationForm = new static($attributes);

        give(DonationFormRepository::class)->insert($donationForm);

        return $donationForm;
    }

    /**
     * @unreleased
     *
     * @return void
     *
     * @throws Exception|InvalidArgumentException
     */
    public function save()
    {
        if (!$this->id) {
            give(DonationFormRepository::class)->insert($this);
        } else {
            give(DonationFormRepository::class)->update($this);
        }
    }

    public function delete()
    {
        give(DonationFormRepository::class)->delete($this);
    }

    /**
     * @unreleased
     *
     * @return ModelQueryBuilder<DonationForm>
     */
    public static function query(): ModelQueryBuilder
    {
        return give(DonationFormRepository::class)->prepareQuery();
    }

    /**
     * @unreleased
     *
     * @param $object
     *
     * @return DonationForm
     */
    public static function fromQueryBuilderObject($object): DonationForm
    {
        return DonationFormQueryData::fromObject($object)->toDonationForm();
    }
}
