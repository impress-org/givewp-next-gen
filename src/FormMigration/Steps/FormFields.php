<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Contracts\FormMigrationStep;
use Give\Framework\Blocks\BlockModel;

class FormFields extends FormMigrationStep
{
    public function process()
    {
        $this->fieldBlocks->findByName('givewp/donor-name')
            ->setAttribute('showHonorific', $this->formV2->isNameTitlePrefixEnabled())
            ->setAttribute('honorifics', $this->formV2->getNameTitlePrefixes())
            ->setAttribute('requireLastName', $this->formV2->isLastNameRequired());

        // Company Donations
        if($this->formV2->isCompanyFieldEnabled()) {
            $this->fieldBlocks->insertAfter('givewp/donor-name', BlockModel::make([
                'name' => 'givewp/company',
                'attributes' => [
                    'label' => __('Company Name', 'give'),
                    'isRequired' => $this->formV2->isCompanyFieldRequired(),
                ]
            ]));
        }

        // Set default gateway
        // @note No corresponding setting in v3 for "Default Gateway"

        // Anonymous Donations
        // @note No corresponding setting in v3 for "Anonymous Donations"

        // Donor Comments
        // @note no corresponding setting in v3 for "Donor Comments

        // Guest Donations & Registration
        // @note In v3 all donors are registered as users, so no need for a registration setting.
        // @note The "Guest Donation" setting corresponds to the `_give_logged_in_only` meta, which seems backwards.
        $guestDonations = $this->getMetaV2('_give_logged_in_only'); // enabled, disabled
        $userRegistration = $this->getMetaV2('_give_show_register_form'); // none, registration, login, both

        if(in_array($userRegistration, ['registration', 'login', 'both'])) {
            $loginRequired = 'disabled' === $guestDonations;
            $loginBlock = BlockModel::make([
                'name' => 'givewp/login',
                'attributes' => [
                    'required' => $loginRequired,
                    'loginRedirect' => false,
                    'loginNotice' => __('Already have an account?', 'give'),
                    'loginConfirmation' => __('Thank you for your continued support.', 'give'),
                ]
            ]);

            if($loginRequired) {
                $this->fieldBlocks->insertBefore('givewp/donor-name', $loginBlock);
            } else {
                $this->fieldBlocks->insertAfter('givewp/email', $loginBlock);
            }
        }
    }
}
