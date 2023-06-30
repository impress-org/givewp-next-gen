<?php

namespace Give\FormMigration;

use Give\DonationForms\V2\Models\DonationForm;

class FormMetaDecorator
{
    /**
     * @var DonationForm
     */
    protected $form;

    public function __construct(DonationForm $form)
    {
        $this->form = $form;
    }

    public function __call($name, $arguments)
    {
        return $this->form->{$name}(...$arguments);
    }

    public function __get($name)
    {
        return $this->form->{$name};
    }

    public function __set($name, $value)
    {
        $this->form->{$name} = $value;
    }

    public function isLastNameRequired(): bool
    {
        return give_is_last_name_required($this->form->id);
    }

    public function isNameTitlePrefixEnabled(): bool
    {
        return give_is_name_title_prefix_enabled($this->form->id);
    }

    public function getNameTitlePrefixes(): array
    {
        return give_get_name_title_prefixes($this->form->id);
    }

    public function isCompanyFieldEnabled(): bool
    {
        return give_is_company_field_enabled($this->form->id);
    }

    public function isCompanyFieldRequired(): bool
    {
        // @note Forked from give/includes/process-donation.php:718
        if (give_is_company_field_enabled($this->form->id)) {
            $form_option = give_get_meta($this->form->id, '_give_company_field', true);
            $global_setting = give_get_option('company_field');

            if (!empty($form_option) && give_is_setting_enabled($form_option, ['required'])) {
                return true;
            } elseif ('global' === $form_option && give_is_setting_enabled($global_setting, ['required'])) {
                return true;
            } elseif (empty($form_option) && give_is_setting_enabled($global_setting, ['required'])) {
                return true;
            }
        }
        return false;
    }
}
