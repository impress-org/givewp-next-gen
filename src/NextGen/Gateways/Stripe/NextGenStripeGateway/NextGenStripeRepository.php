<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Framework\Exceptions\Primitives\Exception;
use Give\Framework\Support\ValueObjects\Money;
use Give\PaymentGateways\Exceptions\InvalidPropertyName;
use Give\PaymentGateways\Gateways\Stripe\Actions\SaveDonationSummary;
use Give\PaymentGateways\Stripe\ApplicationFee;
use Stripe\Customer;
use Stripe\ErrorObject;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\InvalidRequestException;
use Stripe\PaymentIntent;

trait NextGenStripeRepository {
    /**
     * @unreleased
     * @throws ApiErrorException
     */
    protected function generateStripePaymentIntent($accountId, Money $amount): PaymentIntent
    {
        return PaymentIntent::create(
            [
                'amount' => $amount->formatToMinorAmount(),
                'currency' => $amount->getCurrency()->getCode(),
                'automatic_payment_methods' => ['enabled' => true],
            ],
            ['stripe_account' => $accountId]
        );
    }

    /**
     * Get or create Stripe Customer from Donation
     *
     * @unreleased
     * @throws Exception
     * @throws ApiErrorException
     */
    public function getOrCreateStripeCustomerFromDonation(
        string $connectAccountId,
        Donation $donation
    ): Customer
    {
        $donorCustomerId = give_stripe_get_customer_id($donation->email) ?? '';

        // create a new customer if the donor does not have a stripe id
        if (!$donorCustomerId) {
            $customer = $this->createCustomer($donation, $connectAccountId);
        } else {
            try {
                // if the donor has a stripe ID, try retrieving the customer from Stripe.
                $customer = $this->retrieveCustomer($donorCustomerId, $connectAccountId);

                // if the customer is deleted, create a new customer
                if ($customer->isDeleted()) {
                    $customer = $this->createCustomer($donation, $connectAccountId);
                }
            } catch (InvalidRequestException $exception) {
                // If the donor has a stripe id but is not valid with this account,
                // a resource_missing error will be thrown. In this case, we need to
                // create a new customer.  The newer Stripe api has a search functionality
                // that would make more sense here.
                if ($exception->getStripeCode() === ErrorObject::CODE_RESOURCE_MISSING) {
                    $customer = $this->createCustomer($donation, $connectAccountId);
                } else {
                    throw $exception;
                }
            }
        }

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(__('Stripe Customer ID: %s', 'give'), $customer->id)
        ]);


        // save the stripe ID to donor meta
        // it appears this does not account for multiple stripe accounts
        if ($customer->id !== $donorCustomerId) {
            give()->donor_meta->update_meta($donation->donorId, give_stripe_get_customer_key(), $customer->id);
        }

        // also save to donation meta
        give_update_meta($donation->id, give_stripe_get_customer_key(), $customer->id);

        return $customer;
    }

     /**
     * @unreleased
     * @throws ApiErrorException
     */
    protected function updateStripePaymentIntent(string $id, array $data): PaymentIntent
    {
        return PaymentIntent::update(
            $id,
            $data
        );
    }

    /**
     * @unreleased
     *
     * @throws InvalidPropertyName
     */
    protected function getPaymentIntentArgsFromDonation(Donation $donation, Customer $customer): array
    {
        // Collect intent args to be updated
        $intentArgs = [
            'amount' => $donation->amount->formatToMinorAmount(),
            'customer' => $customer->id,
            'description' => (new SaveDonationSummary)($donation)->getSummaryWithDonor(),
            'metadata' => give_stripe_prepare_metadata($donation->id),
        ];

        // Add application fee, if the Stripe premium add-on is not active.
        if (ApplicationFee::canAddfee()) {
            $intentArgs['application_fee_amount'] = give_stripe_get_application_fee_amount(
                $donation->amount->getAmount()
            );
        }

        // Add statement descriptor
        $intentArgs['statement_descriptor'] = give_stripe_get_statement_descriptor();

        // Send Stripe Receipt emails when enabled.
        if (give_is_setting_enabled(give_get_option('stripe_receipt_emails'))) {
            $intentArgs['receipt_email'] = $donation->email;
        }

        return $intentArgs;
   }

    /**
     * @return void
     * @throws Exception
     */
   protected function updateDonationMetaFromPaymentIntent(Donation $donation, PaymentIntent $intent)
   {
       $donation->gatewayTransactionId = $intent->id;
       $donation->save();

       DonationNote::create([
           'donationId' => $donation->id,
           'content' => sprintf(__('Stripe Charge/Payment Intent ID: %s', 'give'), $intent->id)
       ]);

       DonationNote::create([
           'donationId' => $donation->id,
           'content' => sprintf(__('Stripe Payment Intent Client Secret: %s', 'give'), $intent->client_secret)
       ]);

       give_update_meta(
           $donation->id,
           '_give_stripe_payment_intent_client_secret',
           $intent->client_secret
       );
   }

    /**
     * @unreleased
     */
    protected function getStripePublishableKey(int $formId): string
    {
        return give_stripe_get_publishable_key($formId);
    }

    /**
     * @unreleased
     */
    protected function getStripeConnectedAccountKey(int $formId): string
    {
        return give_stripe_get_connected_account_id($formId);
    }

    /**
     * @unreleased
     *
     * @return void;
     */
    protected function setUpStripeAppInfo(int $formId)
    {
        give_stripe_set_app_info($formId);
    }

    /**
     * @unreleased
     *
     * @throws ApiErrorException
     */
    protected function createCustomer(Donation $donation, string $connectAccountId): Customer
    {
        return Customer::create(
            [
                'name' => "$donation->firstName $donation->lastName",
                'email' => $donation->email,
            ],
            ['stripe_account' => $connectAccountId]
        );
    }

    /**
     * @unreleased
     *
     * @throws ApiErrorException|InvalidRequestException
     */
    protected function retrieveCustomer(string $customerId, string $connectAccountId): Customer
    {
        return Customer::retrieve($customerId, ['stripe_account' => $connectAccountId]);
    }
}
