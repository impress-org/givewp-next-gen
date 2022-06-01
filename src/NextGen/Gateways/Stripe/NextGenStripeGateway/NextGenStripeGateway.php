<?php

namespace Give\NextGen\Gateways\Stripe\NextGenStripeGateway;

use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Framework\EnqueueScript;
use Give\Framework\Http\Response\Types\JsonResponse;
use Give\Framework\PaymentGateways\Commands\GatewayCommand;
use Give\Framework\PaymentGateways\Commands\RespondToBrowser;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\Traits\HasRequest;
use Give\Framework\Support\ValueObjects\Money;
use Give\Helpers\Call;
use Give\PaymentGateways\Gateways\Stripe\Actions\SaveDonationSummary;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;

use function Give\Framework\Http\Response\response;

/**
 * @unreleased
 */
class NextGenStripeGateway extends PaymentGateway
{
    use HasRequest;

    public $routeMethods = [
        'updatePaymentIntent'
    ];

    /**
     * @inheritDoc
     */
    public static function id(): string
    {
        return 'next-gen-stripe';
    }

    /**
     * @inheritDoc
     */
    public function getId(): string
    {
        return self::id();
    }

    /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return __('Next Gen Stripe - Credit Card', 'give');
    }

    /**
     * @inheritDoc
     */
    public function getPaymentMethodLabel(): string
    {
        return __('Next Gen Stripe - Credit Card', 'give');
    }

    /**
     * @unreleased
     */
    public function enqueueScript(): EnqueueScript
    {
        return new EnqueueScript(
            $this->getId(),
            'build/nextGenStripeGateway.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
    }

    /**
     * @unreleased
     */
    public function formSettings($formId): array
    {
        give_stripe_set_app_info($formId);

        $stripePublishableKey = give_stripe_get_publishable_key($formId);
        $stripeConnectedAccountKey = give_stripe_get_connected_account_id($formId);
        $currency = give_get_currency($formId);
        $formDefaultAmount = give_get_default_form_amount($formId);
        $defaultAmount = Money::fromDecimal(!empty($formDefaultAmount) ? $formDefaultAmount : '50', $currency);
        $stripePaymentIntent = $this->generateStripePaymentIntent(
            $stripeConnectedAccountKey,
            $defaultAmount
        );

        return [
            'stripeKey' => $stripePublishableKey,
            'stripeClientSecret' => $stripePaymentIntent->client_secret,
            'stripeConnectedAccountKey' => $stripeConnectedAccountKey,
            'successUrl' => give_get_success_page_uri(),
            'stripePaymentIntentId' => $stripePaymentIntent->id,
            'updatePaymentIntentUrl' => $this->generateGatewayRouteUrl(
                'updatePaymentIntent',
                [
                    'stripePaymentIntentId' => $stripePaymentIntent->id,
                    'stripeConnectedAccountKey' => $stripeConnectedAccountKey
                ]
            )
        ];
    }

    /**
     * Mocking Payment Intent while building out api
     *
     * @unreleased
     */
    private function generateStripePaymentIntent($accountId, Money $amount): PaymentIntent
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
     * @unreleased
     *
     * @throws ApiErrorException
     */
    public function updatePaymentIntent(array $queryParams): JsonResponse
    {
        /**
         * Get data from client request
         */
        $request = $this->request();

        $stripeConnectedAccountKey = $queryParams['stripeConnectedAccountKey'];
        $stripePaymentIntentId = $queryParams['stripePaymentIntentId'];
        $amount = $request->get('amount') * 100;
        $firstName = $request->get('firstName');
        $lastName = $request->get('lastName');
        $email = $request->get('email');
        $customerId = give_stripe_get_customer_id($email) ?? '';

        /**
         * Get or create a Stripe customer
         */
        $customer = $this->getOrCreateStripeCustomer(
            $customerId,
            $stripeConnectedAccountKey,
            $email,
            "$firstName $lastName"
        );

        $intent = $this->updateStripePaymentIntent(
            $stripePaymentIntentId,
            [
                'amount' => $amount,
                'customer' => $customer->id
            ]
        );

        return response()->json([
            'status' => $intent->status
        ]);
    }

    /**
     * Get or create Stripe Customer
     *
     * @unreleased
     */
    public function getOrCreateStripeCustomer(
        string $customerId,
        string $connectAccountId,
        string $email,
        string $name
    ): Customer {
        // make sure customerId still exists in  connect account
        if ($customerId) {
            $customer = Customer::retrieve($customerId, ['stripe_account' => $connectAccountId]);
        }

        // create a new customer if necessary
        if (!$customerId || !$customer) {
            $customer = Customer::create(
                [
                    'name' => $name,
                    'email' => $email,
                ],
                ['stripe_account' => $connectAccountId]
            );
        }

        return $customer;
    }

    /**
     * @inheritDoc
     */
    public function createPayment(Donation $donation): GatewayCommand
    {
        $stripePaymentIntentId = $this->request()->get('stripePaymentIntentId');
        $donation->gatewayTransactionId = $stripePaymentIntentId;
        $donation->save();

        // @todo: payment method may need to be saved on the webhook side
        $paymentIntent = PaymentIntent::retrieve($stripePaymentIntentId);
        $paymentMethodId = $paymentIntent->payment_method;

        give_update_meta($donation->id, '_give_stripe_source_id', $paymentMethodId);

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(__('Stripe Source/Payment Method ID: %s', 'give'), $paymentMethodId)
        ]);

        $donationSummary = Call::invoke(SaveDonationSummary::class, $donation);

        $intent = $this->updateStripePaymentIntent(
            $stripePaymentIntentId,
            [
                'description' => $donationSummary->getSummaryWithDonor(),
                'metadata' => give_stripe_prepare_metadata($donation->id),
            ]
        );

        DonationNote::create([
            'donationId' => $donation->id,
            'content' => sprintf(__('Stripe Charge/Payment Intent ID: %s', 'give'), $stripePaymentIntentId)
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

        return new RespondToBrowser([
            'status' => 200
        ]);
    }

    /**
     * @inheritDoc
     */
    public function getLegacyFormFieldMarkup(int $formId, array $args): string
    {
        return 'Legacy Stripe Fields Not Supported.';
    }

    /**
     * @inheritDoc
     */
    public function refundDonation(Donation $donation)
    {
        // TODO: Implement refundDonation() method.
    }

    /**
     * @unreleased
     */
    private function updateStripePaymentIntent(string $id, array $data): PaymentIntent
    {
        return PaymentIntent::update(
            $id,
            $data
        );
    }
}
