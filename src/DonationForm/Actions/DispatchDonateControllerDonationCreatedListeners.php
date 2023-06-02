<?php
namespace Give\DonationForm\Actions;

use Give\DonationForm\DataTransferObjects\DonateControllerData;
use Give\DonationForm\Listeners\AddRedirectUrlsToGatewayData;
use Give\DonationForm\Listeners\StoreCustomFields;
use Give\DonationForm\Listeners\TemporarilyReplaceLegacySuccessPageUri;
use Give\Donations\Models\Donation;

class DispatchDonateControllerDonationCreatedListeners
{
    /**
     * @since 0.3.0
     */
    public function __invoke(DonateControllerData $formData, Donation $donation)
    {
        (new StoreCustomFields())($formData->getDonationForm(), $donation, $formData->getCustomFields());
        (new TemporarilyReplaceLegacySuccessPageUri())($formData, $donation);
        (new AddRedirectUrlsToGatewayData())($formData, $donation);
    }
}