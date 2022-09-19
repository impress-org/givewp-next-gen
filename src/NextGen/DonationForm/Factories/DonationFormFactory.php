<?php

namespace Give\NextGen\DonationForm\Factories;

use Give\Framework\FieldsAPI\Form;
use Give\Framework\FieldsAPI\Section;
use Give\Framework\FieldsAPI\Text;
use Give\Framework\Models\Factories\ModelFactory;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;

class DonationFormFactory extends ModelFactory
{
    public function definition()
    {
        return [
            'formTitle' => 'Form Title',
            'status' => DonationFormStatus::PENDING(),
            'settings' => [
                'enableDonationGoal' => false,
                'enableAutoClose' => false,
                'registration' => 'none',
                'goalFormat' => 'amount-raised',
            ],
        ];
    }
}
