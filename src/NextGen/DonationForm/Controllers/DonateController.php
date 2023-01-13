<?php

namespace Give\NextGen\DonationForm\Controllers;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donors\Models\Donor;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\NextGen\DonationForm\Actions\StoreCustomFields;
use Give\NextGen\DonationForm\DataTransferObjects\DonateControllerData;
use Give\NextGen\DonationForm\Models\DonationForm;

/**
 * @unreleased
 */
class DonateController
{
    /**
     * First we create a donation, then move on to the gateway processing
     *
     * @unreleased
     *
     * @return void
     * @throws Exception
     */
    public function donate(DonateControllerData $formData, PaymentGateway $registeredGateway)
    {
        $donor = $this->getOrCreateDonor(
            $formData->wpUserId,
            $formData->email,
            $formData->firstName,
            $formData->lastName
        );

        $donation = $formData->toDonation($donor->id);
        $donation->save();

        $form = $formData->getDonationForm();

        $this->saveCustomFields($form, $donation, $formData->getCustomFields());

        $this->filterSuccessPageUri($formData->getDonationConfirmationReceiptViewRouteUrl($donation));

        $this->filterGatewayData($formData, $donation);

        $registeredGateway->handleCreatePayment($donation);
    }

    /**
     * @unreleased
     *
     * @param  int|null  $userId
     * @param  string  $donorEmail
     * @param  string  $firstName
     * @param  string  $lastName
     *
     * @return Donor
     * @throws Exception
     */
    private function getOrCreateDonor(
        int $userId,
        string $donorEmail,
        string $firstName,
        string $lastName
    ): Donor {
        // first check if donor exists as a user
        $donor = Donor::whereUserId($userId);

        // If they exist as a donor & user then make sure they don't already own this email before adding to their additional emails list..
        if ($donor && !$donor->hasEmail($donorEmail)) {
            $donor->additionalEmails = array_merge($donor->additionalEmails ?? [], [$donorEmail]);
            $donor->save();
        }

        // if donor is not a user than check for any donor matching this email
        if (!$donor) {
            $donor = Donor::whereEmail($donorEmail);
        }

        // if no donor exists then create a new one using their personal information from the form.
        if (!$donor) {
            $donor = Donor::create([
                'name' => trim("$firstName $lastName"),
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $donorEmail,
                'userId' => $userId ?: null
            ]);
        }

        return $donor;
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function saveCustomFields(DonationForm $form, Donation $donation, array $customFields)
    {
        (new StoreCustomFields())($form, $donation, $customFields);
    }

    /**
     * Use our new receipt url for the success page uri
     *
     * @unreleased
     *
     * @return void
     */
    protected function filterSuccessPageUri(string $filteredUrl)
    {
        add_filter('give_get_success_page_uri', static function ($url) use ($filteredUrl) {
            return $filteredUrl;
        });
    }

    /**
     * @unreleased
     *
     * @return void
     */
    protected function filterGatewayData(DonateControllerData $formData, $donation)
    {
         add_filter("givewp_create_payment_gateway_data_{$donation->gatewayId}", static function($data) use ($formData, $donation) {
            return array_merge($data, [
                'redirectReturnUrl' => $formData->getRedirectReturnUrl($donation),
            ]);
        });
    }
}
