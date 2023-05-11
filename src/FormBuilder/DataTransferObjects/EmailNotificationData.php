<?php

namespace Give\FormBuilder\DataTransferObjects;

use Give\FormBuilder\Actions\ConvertNotificationToDTO;

/**
 * @since 0.1.0
 */
class EmailNotificationData
{
    /** @var string */
    public $id;

    /** @var string */
    public $title;

    /** @var array */
    public $statusOptions;

    /** @var bool */
    public $supportsRecipients;

    /** @var array */
    public $defaultValues;

    public static function fromLegacyNotification($notification): EmailNotificationData
    {
        return (new ConvertNotificationToDTO($notification))->toDto();
    }
}
