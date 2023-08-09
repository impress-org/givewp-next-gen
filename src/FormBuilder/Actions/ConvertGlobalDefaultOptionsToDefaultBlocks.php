<?php

namespace Give\FormBuilder\Actions;

use Give\DonationForms\Models\DonationForm;
use Give\Framework\Blocks\BlockModel;

/**
 * In v2 forms, there was a concept of "Default Options" in global GiveWP settings.
 * In v3 forms, we have "Default Blocks" instead.  This action converts the global default options into default blocks.
 *
 * @unreleased
 */
class ConvertGlobalDefaultOptionsToDefaultBlocks
{
    /**
     * @unreleased
     */
    public function __invoke(DonationForm $form)
    {
        $this->handleDonorComments($form);
    }

    /**
     * @unreleased
     */
    protected function handleDonorComments(DonationForm $form)
    {
        if (give_is_donor_comment_field_enabled($form->id)) {
            $block = BlockModel::make([
                'name' => 'givewp/donor-comments',
                'attributes' => [
                    'label' => __('Comment', 'give'),
                    'description' => __('Would you like to add a comment to this donation?', 'give'),
                ],
            ]);

            $form->blocks->insertAfter('givewp/email', $block);
        }
    }
}