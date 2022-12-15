<?php

namespace Give\NextGen\DonationForm\Properties;

use Give\Framework\Support\Contracts\Arrayable;
use Give\Framework\Support\Contracts\Jsonable;
use Give\NextGen\DonationForm\FormDesigns\ClassicFormDesign\ClassicFormDesign;
use Give\NextGen\DonationForm\ValueObjects\GoalType;

class FormSettings implements Arrayable, Jsonable {
    /**
     * @var boolean
     */
    public $showHeading;
    /**
     * @var boolean
     */
    public $showDescription;
    /**
     * @var string
     */
    public $formTitle;
    /**
     * @var boolean
     */
    public $enableDonationGoal;
    /**
     * @var boolean
     */
    public $enableAutoClose;
    /**
     * @var GoalType
     */
    public $goalType;
    /**
     * @var string
     */
    public $designId;
    /**
     * @var string
     */
    public $heading;
    /**
     * @var string
     */
    public $description;
    /**
     * @var string
     */
    public $primaryColor;
    /**
     * @var string
     */
    public $secondaryColor;
    /**
     * @var float
     */
    public $goalAmount;
    /**
     * @var string
     */
    public $registration;
    /**
     * @var string
     */
    public $customCss;

    /**
     * @unreleased
     */
    public static function fromArray(array $array): self
    {
        $self = new self();

        $self->showHeading = $array['showHeading'] ?? true;
        $self->heading = $array['heading'] ?? __('Support Our Cause', 'give');
        $self->showDescription = $array['showDescription'] ?? true;
         $self->description = $array['description'] ?? __(
            'Help our organization by donating today! Donations go to making a difference for our cause.',
            'give'
        );
        $self->formTitle =  $array['formTitle'] ?? __('Donation Form', 'give');
        $self->enableDonationGoal = $array['enableDonationGoal'] ?? false;
        $self->enableAutoClose = $array['enableAutoClose'] ?? false;
        $self->goalType = !empty($array['goalType']) ? new GoalType($array['goalType']) : GoalType::AMOUNT();
        $self->designId = $array['designId'] ?? ClassicFormDesign::id();
        $self->primaryColor = $array['primaryColor'] ?? '#69b86b';
        $self->secondaryColor = $array['secondaryColor'] ?? '#f49420';
        $self->goalAmount = $array['goalAmount'] ?? 0;
        $self->registration = $array['registration'] ?? 'none';
        $self->customCss = $array['customCss'] ?? '';

        return $self;
    }

    /**
     * @unreleased
     */
    public static function fromJson(string $json): self
    {
        $self = new self();
        $array = json_decode($json, true);

        return $self::fromArray($array);
    }

    /**
     * @unreleased
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    /**
     * @unreleased
     */
    public function toJson($options = 0): string
    {
        return json_encode(
            array_merge(
                $this->toArray(),
                [
                    'goalType' => $this->goalType ? $this->goalType->getValue() : null
                ]
            )
        );
    }
}