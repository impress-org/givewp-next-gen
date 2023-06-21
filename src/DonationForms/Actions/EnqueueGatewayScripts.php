<?php

namespace Give\DonationForms\Actions;

use Give\DonationForms\Repositories\DonationFormRepository;

class EnqueueGatewayScripts
{
    /**
     * @unreleased
     * @return void
     */
    public function __invoke(int $formId)
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        // load gateway scripts
        foreach ($donationFormRepository->getEnabledPaymentGateways($formId) as $gateway) {
            if (method_exists($gateway, 'enqueueScript')) {
                $gateway->enqueueScript($formId);
            }
        }
    }
}