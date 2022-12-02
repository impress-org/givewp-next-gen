<?php

namespace Give\CustomFields\Views;

use Give\Donations\Models\Donation;
use Give\Framework\FieldsAPI\Field;

class DonorDetailsView
{
    protected $donor;
    protected $fields;

    public function __construct($donor, $fields)
    {
        $this->donor = $donor;
        $this->fields = $fields;
    }

    public function render(): string
    {
        return "
        <h3>{$this->getTitle()}</h3>
        <table class='wp-list-table widefat striped donations'>
			<thead>
                <tr>
                    <th scope='col'>Field</th>
                    <th scope='col'>Value</th>
                </tr>
			</thead>
			<tbody>
			    {$this->getTableRows()}
            </tbody>
		</table>
        ";
    }

    protected function getTitle()
    {
        return __('Custom Fields', 'givewp');
    }

    protected function getTableRows()
    {
        return array_reduce($this->fields, function($output, Field $field) {
            return $output . "
                <tr>
                    <td>{$field->getLabel()}</td>
                    <td>{$this->getFieldValue($field)}</td>
                </tr>
            ";
        }, '');
    }

    protected function getFieldValue(Field $field)
    {
        return give()->donor_meta->get_meta($this->donor->userId, $field->getName(), true);
    }
}
