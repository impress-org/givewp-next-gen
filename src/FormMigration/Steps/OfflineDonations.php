<?php

namespace Give\FormMigration\Steps;

use Give\FormMigration\Contracts\FormMigrationStep;

class OfflineDonations extends FormMigrationStep
{
    public function canHandle(): bool
    {
        return $this->formV2->isOfflineDonationsEnabled();
    }

    public function process()
    {
        if($this->formV2->isOfflineDonationsBillingFieldEnabled()) {
            // @todo Insert billing field if Offline Donations is enabled.
        }

        // @todo Map donation instructions to v3 form.
        $donationInstructions = $this->formV2->getOfflineDonationInstructions();
    }
}
