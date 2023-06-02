<?php
namespace Give\DonationForm\Actions;

use Give\DonationForm\DataTransferObjects\DonateControllerData;
use Give\DonationForm\Listeners\UpdateSubscriptionWithLegacyParentPaymentId;
use Give\Donations\Models\Donation;
use Give\Subscriptions\Models\Subscription;

class DispatchDonateControllerSubscriptionCreatedListeners
{
    /**
     * @since 0.3.0
     */
    public function __invoke(DonateControllerData $formData, Subscription $subscription, Donation $donation)
    {
        (new UpdateSubscriptionWithLegacyParentPaymentId())($subscription->id, $donation->id);
    }
}