<?php

namespace Give\CustomFields;

use Give\CustomFields\Controllers\DonationDetailsController;
use Give\CustomFields\Controllers\DonorDetailsController;
use Give\Donors\Models\Donor;
use Give\Framework\FieldsAPI\Field;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;
use Give_Donor as LegacyDonor;

/**
 * @since 0.1.0
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
        Field::macro('shouldDisplayInAdmin', function() {
            return isset($this->displayInAdmin) && $this->displayInAdmin;
        });

        Field::macro('shouldDisplayInReceipt', function() {
            return isset($this->displayInReceipt) && $this->displayInReceipt;
        });
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        add_action('give_donor_after_tables', static function (LegacyDonor $legacyDonor) {
            /** @var Donor $donor */
            $donor = Donor::find($legacyDonor->id);
            
            echo (new DonorDetailsController())->show($donor);
        });

        add_action('give_view_donation_details_billing_after', static function ($donationId) {
            echo (new DonationDetailsController())->show($donationId);
        });
    }
}
