<?php

namespace Give\CustomFields\Views;

use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Field;

class DonationDetailsView
{
    protected $donation;
    protected $fields;

    public function __construct(Donation $donation, $fields)
    {
        $this->donation = $donation;
        $this->fields = $fields;
    }

    public function render()
    {
        return "
        <div class='postbox' style='padding-bottom: 15px;'>
            <h3 class='handle'>{$this->getTitle()}</h3>
            <div class='inside'>{$this->getContents()}</div>
        </div>
        ";
    }

    protected function getTitle()
    {
        return __('Custom Fields', 'givewp');
    }

    protected function getContents()
    {
        return array_reduce($this->fields, function($output, Field $field) {
            return $output . "
                <div>
                    <strong>{$field->getLabel()}:</strong>&nbsp;
                    {$this->getFieldValue($field)}
                </div>
            ";
        }, '');
    }

    protected function getFieldValue(Field $field)
    {
        return give_get_meta( $this->donation->id, $field->getName(), true );
    }
}
