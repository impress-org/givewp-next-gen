<?php

namespace Give\FormBuilder\ViewModels;

use Give\FormBuilder\DataTransferObjects\EmailNotificationData;
use Give\FormBuilder\ValueObjects\FormBuilderRestRouteConfig;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\NextGen\DonationForm\Actions\GenerateDonationFormPreviewRouteUrl;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\FormDesigns\FormDesign;
use Give\NextGen\Framework\FormDesigns\Registrars\FormDesignRegistrar;

class FormBuilderViewModel
{
    /**
     * @since 0.1.0
     */
    public function storageData(int $donationFormId): array
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($donationFormId);

        return [
            'formId' => $donationFormId,
            'resourceURL' => rest_url(FormBuilderRestRouteConfig::NAMESPACE . '/form/' . $donationFormId),
            'previewURL' => (new GenerateDonationFormPreviewRouteUrl())($donationFormId),
            'nonce' => wp_create_nonce('wp_rest'),
            'blockData' => $donationForm->blocks->toJson(),
            'settings' => $donationForm->settings->toJson(),
            'currency' => give_get_currency(),
            'formDesigns' => array_map(static function ($designClass) {
                /** @var FormDesign $design */
                $design = give($designClass);

                return [
                    'id' => $design::id(),
                    'name' => $design::name(),
                ];
            }, give(FormDesignRegistrar::class)->getDesigns()),
            'formPage' => [
                'isEnabled' => give_is_setting_enabled(give_get_option('forms_singular')), // Note: Boolean values must be nested in an array to maintain boolean type, see \WP_Scripts::localize().
                'permalink' => add_query_arg(['p' => $donationFormId], site_url('?post_type=give_forms')),
                'rewriteSlug' => get_post_type_object('give_forms')->rewrite['slug'],
            ],
            'gateways' => $this->getGateways(),
            'gatewaySettingsUrl' => admin_url('edit.php?post_type=give_forms&page=give-settings&tab=gateways'),
            'isRecurringEnabled' => defined('GIVE_RECURRING_VERSION') ? GIVE_RECURRING_VERSION : null,
            'recurringAddonData' => [
                'isInstalled' => defined('GIVE_RECURRING_VERSION'),
            ],
            'emailTemplateTags' => array_values(give()->email_tags->get_tags()),
            'emailNotifications' => array_map(static function ($notification) {
                return EmailNotificationData::fromLegacyNotification($notification);
            }, apply_filters('give_email_notification_options_metabox_fields', array(), $donationFormId)),
            'emailPreviewURL' => rest_url('givewp/next-gen/email-preview'),
            'emailDefaultAddress' => get_option('admin_email'),
        ];
    }

    /**
     * @unreleased
     */
    public function jsPathFromPluginRoot(): string
    {
        return 'build/formBuilderApp.js';
    }

    /**
     * @unreleased
     */
    public function jsDependencies(): array
    {
        $scriptAsset = require GIVE_NEXT_GEN_DIR . 'build/formBuilderApp.asset.php';

        return $scriptAsset['dependencies'];
    }

    /**
     * @unreleased
     */
    public function getGateways(): array
    {
        $enabledGateways = array_keys(give_get_option('gateways'));

        $supportedGateways = array_filter(
            give(PaymentGatewayRegister::class)->getPaymentGateways(),
            static function ($gateway) {
                return is_a($gateway, NextGenPaymentGatewayInterface::class, true);
            }
        );

        $builderPaymentGatewayData = array_map(static function ($gatewayClass) use ($enabledGateways) {
            $gateway = give($gatewayClass);
            return [
                'id' => $gateway::id(),
                'enabled' => in_array($gateway::id(), $enabledGateways, true),
                'label' => give_get_gateway_checkout_label($gateway::id()) ?? $gateway->getPaymentMethodLabel(),
                'supportsSubscriptions' => $gateway->supportsSubscriptions(),
            ];
        }, $supportedGateways);

        return array_values($builderPaymentGatewayData);
    }
}
