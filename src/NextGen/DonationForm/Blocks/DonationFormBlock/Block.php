<?php

namespace Give\NextGen\DonationForm\Blocks\DonationFormBlock;

use Give\Framework\EnqueueScript;
use Give\Framework\FieldsAPI\Email;
use Give\Framework\FieldsAPI\Exceptions\EmptyNameException;
use Give\Framework\FieldsAPI\Form;
use Give\Framework\FieldsAPI\Hidden;
use Give\Framework\FieldsAPI\Radio;
use Give\Framework\FieldsAPI\Section;
use Give\Framework\FieldsAPI\Text;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Helpers\Call;
use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Stripe\PaymentIntent;

class Block
{
    /**
     * @var PaymentGatewayRegister
     */
    private $paymentGatewayRegister;

    /**
     * @unreleased
     *
     * @param  PaymentGatewayRegister  $paymentGatewayRegister
     */
    public function __construct(PaymentGatewayRegister $paymentGatewayRegister)
    {
        $this->paymentGatewayRegister = $paymentGatewayRegister;
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function register()
    {
        register_block_type_from_metadata(
            __DIR__,
            ['render_callback' => [$this, 'render']]
        );
    }

    /**
     * @unreleased
     *
     * @param  array  $attributes
     *
     * @return string
     * @throws EmptyNameException
     */
    public function render(array $attributes): string
    {
        $donationForm = $this->createForm($attributes);

        $donateUrl = Call::invoke(GenerateDonateRouteUrl::class);

        $formId = $attributes['formId'];

        /**
         * Mocking Stripe intent for testing start of front-end gateway api
         * The gateway will eventually be responsible for doing this
         */
        $stripePublishableKey = give_stripe_get_publishable_key($formId);
        $stripeConnectedAccountKey = give_stripe_get_connected_account_id($formId);
        $stripePaymentIntent = $this->generateStripePaymentIntent($stripeConnectedAccountKey);

        $exports = [
            'attributes' => $attributes,
            'form' => $donationForm->jsonSerialize(),
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'stripeKey' => $stripePublishableKey,
            'stripeClientSecret' => $stripePaymentIntent->client_secret,
            'stripeConnectedAccountKey' => $stripeConnectedAccountKey
        ];

        // enqueue front-end scripts
        // since this is using render_callback viewScript in blocks.json will not work.
        $enqueueBlockScript = new EnqueueScript(
            'give-next-gen-donation-form-block-js',
            'src/NextGen/DonationForm/Blocks/DonationFormBlock/build/view.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );

        $enqueuePaymentGatewayRegistrarScript = new EnqueueScript(
            'give-payment-gateway-registrar-js',
            'src/Framework/PaymentGateways/FrontEnd/PaymentGatewayRegistrar/build.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
        ?>

        <?php
        $enqueuePaymentGatewayRegistrarScript->loadInFooter()->enqueue();

        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
            if (method_exists($gateway, 'enqueueScript')) {
                $gateway->enqueueScript()->loadInFooter()->enqueue();
            }
        }

        $enqueueBlockScript->loadInFooter()->enqueue();

        ob_start(); ?>

        <div id="root-give-next-gen-donation-form-block"></div>

        <script>window.giveNextGenExports = <?= wp_json_encode($exports) ?>;</script>

        <?php
        return ob_get_clean();
    }

    /**
     * @unreleased
     *
     * @param  array  $attributes
     * @return Form
     * @throws EmptyNameException
     */
    private function createForm($attributes): Form
    {
        $gatewayOptions = [];
        foreach ($this->getEnabledPaymentGateways($attributes['formId']) as $gateway) {
            $gatewayOptions[] = Radio::make($gateway->getId())->label($gateway->getPaymentMethodLabel());
        }

        $donationForm = new Form('DonationForm');

        $donationForm->append(
            Section::make('donationDetails')
                ->label(__('Donation Details', 'give'))
                ->append(
                    Text::make('amount')
                        ->label(__('Donation Amount', 'give'))
                        ->defaultValue(50)
                        ->required()
                ),

            Section::make('donorDetails')
                ->label(__('Donor Details', 'give'))
                ->append(
                    Text::make('firstName')
                        ->label(__('First Name', 'give'))
                        ->required(),

                    Text::make('lastName')
                        ->label(__('Last Name', 'give'))
                        ->required(),

                    Email::make('email')
                        ->label(__('Email', 'give'))
                        ->required()
                        ->emailTag('email')
                ),

            Section::make('paymentDetails')
                ->label(__('Payment Details', 'give'))
                ->append(...$gatewayOptions),

            Hidden::make('formId')
                ->defaultValue($attributes['formId']),

            Hidden::make('formTitle')
                ->defaultValue('Give Next Gen Form'),

            Hidden::make('userId')
                ->defaultValue(get_current_user_id()),

            Hidden::make('currency')
                ->defaultValue(give_get_currency($attributes['formId']))
        );

        return $donationForm;
    }

    /**
     * @return PaymentGateway[]
     */
    public function getEnabledPaymentGateways($formId): array
    {
        $gateways = [];

        $enabledGateways = give_get_option('gateways');
        $defaultGateway = give_get_default_gateway($formId);

        foreach ($enabledGateways as $gatewayId => $enabled) {
            if ($enabled && $this->paymentGatewayRegister->hasPaymentGateway($gatewayId)) {
                $gateways[$gatewayId] = $this->paymentGatewayRegister->getPaymentGateway($gatewayId);
            }
        }

        if (array_key_exists($defaultGateway, $gateways)) {
            $gateways = array_merge([$defaultGateway => $gateways[$defaultGateway]], $gateways);
        }

        return $gateways;
    }


    /**
     * Mocking Stripe intent for testing start of front-end gateway api
     * The gateway will eventually be responsible for doing this
     */
    private function generateStripePaymentIntent($accountId)
    {
        return PaymentIntent::create(
            [
                'amount' => 1099,
                'currency' => 'usd',
                'automatic_payment_methods' => ['enabled' => true],
            ],
            ['stripe_account' => $accountId]
        );
    }
}
