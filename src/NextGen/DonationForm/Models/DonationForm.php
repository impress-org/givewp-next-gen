<?php

namespace Give\NextGen\DonationForm\Models;

use Give\Framework\Models\Contracts\ModelCrud;
use Give\Framework\Models\Model;
use Give\NextGen\DonationForm\Traits\DonationFormCRUD;

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
    ];


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
