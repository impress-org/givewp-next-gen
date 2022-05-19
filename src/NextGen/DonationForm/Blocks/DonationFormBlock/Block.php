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
        register_block_type(
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

        $formDataGateways = [];
        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
            if (method_exists($gateway, 'formSettings')) {
                $formDataGateways[$gateway->getId()] = $gateway->formSettings($attributes['formId']);
            }
        }

        $exports = [
            'attributes' => $attributes,
            'form' => $donationForm->jsonSerialize(),
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gateways' => $formDataGateways
        ];

        // enqueue front-end scripts
        // since this is using render_callback viewScript in blocks.json will not work.
        $enqueueBlockScript = new EnqueueScript(
            'give-next-gen-donation-form-block-js',
            'build/DonationFormBlockApp.tsx.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );

        $enqueuePaymentGatewayRegistrarScript = new EnqueueScript(
            'give-payment-gateway-registrar-js',
            'build/paymentGatewayRegistrar.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );
        ?>

        <script>window.giveNextGenExports = <?= wp_json_encode($exports) ?>;</script>

        <?php
        $enqueuePaymentGatewayRegistrarScript->loadInFooter()->enqueue();

        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
            if (method_exists($gateway, 'enqueueScript')) {
                $gateway->enqueueScript()->registerLocalizeData(
                    (new \ReflectionClass($gateway))->getShortName(),
                    [
                        'id' => $gateway->getId(),
                        'label' => $gateway->getPaymentMethodLabel()
                    ]
                )->loadInFooter()->enqueue();
            }
        }

        $enqueueBlockScript->loadInFooter()->enqueue();

        ob_start(); ?>

        <div id="root-give-next-gen-donation-form-block"></div>

        <?php
        return ob_get_clean();
    }

    /**
     * @unreleased
     *
     * @throws EmptyNameException
     */
    private function createForm(array $attributes): Form
    {
        $formId = $attributes['formId'];

        $gatewayOptions = [];
        foreach ($this->getEnabledPaymentGateways($formId) as $gateway) {
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
                ->defaultValue($formId),

            Hidden::make('formTitle')
                ->defaultValue('Give Next Gen Form'),

            Hidden::make('userId')
                ->defaultValue(get_current_user_id()),

            Hidden::make('currency')
                ->defaultValue(give_get_currency($formId))
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
}
