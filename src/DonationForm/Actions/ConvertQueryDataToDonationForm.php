<?php

namespace Give\DonationForm\Actions;

use Give\DonationForm\Models\DonationForm;
use Give\DonationForm\Properties\FormSettings;
use Give\DonationForm\ValueObjects\DonationFormMetaKeys;
use Give\DonationForm\ValueObjects\DonationFormStatus;
use Give\Framework\Blocks\BlockCollection;
use Give\Framework\Support\Facades\DateTime\Temporal;

class ConvertQueryDataToDonationForm
{
    /**
     * @since 0.1.0
     *
     * @param  object  $queryObject
     */
    public function __invoke($queryObject): DonationForm
    {
        return new DonationForm([
            'id' => (int)$queryObject->id,
            'title' => $queryObject->title,
            'createdAt' => Temporal::toDateTime($queryObject->createdAt),
            'updatedAt' => Temporal::toDateTime($queryObject->updatedAt),
            'status' => new DonationFormStatus($queryObject->status),
            'settings' => FormSettings::fromjson($queryObject->{DonationFormMetaKeys::SETTINGS()->getKeyAsCamelCase()}),
            'blocks' => BlockCollection::fromJson($queryObject->{DonationFormMetaKeys::FIELDS()->getKeyAsCamelCase()}),
        ]);
    }
}
