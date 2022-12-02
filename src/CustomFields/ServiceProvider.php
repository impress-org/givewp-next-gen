<?php

namespace Give\CustomFields;

use Give\CustomFields\Controllers\DonationDetailsController;
use Give\CustomFields\Controllers\DonorDetailsController;
use Give\Framework\FieldsAPI\Field;
use Give\Helpers\Hooks;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @unreleased
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
        Hooks::addAction('give_donor_after_tables', DonorDetailsController::class);
        Hooks::addAction('give_view_donation_details_billing_after', DonationDetailsController::class);
    }
}
