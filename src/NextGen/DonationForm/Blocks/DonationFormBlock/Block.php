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

        $exports = [
            'attributes' => $attributes,
            'form' => $donationForm->jsonSerialize(),
            'donateUrl' => $donateUrl,
        ];

        // enqueue front-end scripts
        // since this is using render_callback viewScript in blocks.json will not work.
        $enqueueScripts = new EnqueueScript(
            'give-next-gen-donation-form-block-js',
            'src/NextGen/DonationForm/Blocks/DonationFormBlock/build/view.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        );

        $enqueueScripts->loadInFooter()->enqueue();

        ob_start(); ?>

        <div id="root-give-next-gen-donation-form-block"></div>

        <script>window.giveNextGenExports = <?= wp_json_encode($exports) ?>;</script>

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
        $gatewayOptions = [];
        foreach ($this->getEnabledPaymentGateways($attributes['formId']) as $gateway) {
            $gatewayOptions[] = Radio::make($gateway->getId())->label($gateway->getPaymentMethodLabel());
        }

        $donationForm = new Form('DonationForm');

        $formBlockData = json_decode(get_post($attributes['formId'])->post_content, false);

        foreach( $formBlockData as $block ) {
            $donationForm->append($this->convertFormBlockDataToFieldsAPI($block));
        }
        
        $donationForm->append(
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
     * @unreleased
     *
     * @param  object  $block
     * @return Section|Text
     * @throws EmptyNameException
     */
    protected function convertFormBlockDataToFieldsAPI($block)
    {
        if ($block->innerBlocks) {
            $section = Section::make($block->clientId);

            if (property_exists($block->attributes, 'title')) {
                $section->label($block->attributes->title);
            }

            foreach ($block->innerBlocks as $innerBlock) {
                $section->append($this->convertFormBlockDataToFieldsAPI($innerBlock));
            }

            return $section;
        }

        if ($block->name === "custom-block-editor/donation-amount-levels") {
            $field = Text::make('amount')->required();
        } elseif ($block->name === "custom-block-editor/first-name-field") {
            $field = Text::make('firstName')->required();
        } elseif ($block->name === "custom-block-editor/last-name-field") {
            $field = Text::make('lastName')->required();
        } elseif ($block->name === "custom-block-editor/email-field") {
            $field = Email::make('email')->required()->emailTag('email');
        } else {
            $field = Text::make($block->clientId);
        }

        if (property_exists($block->attributes, 'label')) {
            $field->label($block->attributes->label);
        }

        return $field;
    }
}
