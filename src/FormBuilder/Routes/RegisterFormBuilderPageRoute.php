<?php

namespace Give\FormBuilder\Routes;
use Give\Addon\View;
use Give\FormBuilder\FormBuilderRouteBuilder;
use Give\FormBuilder\ViewModels\FormBuilderViewModel;
use Give\Framework\EnqueueScript;
use Give\Framework\PaymentGateways\Contracts\NextGenPaymentGatewayInterface;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;

use function wp_enqueue_style;

/**
 * Add form builder page route and scripts
 */
class RegisterFormBuilderPageRoute
{
    /**
     * Use add_submenu_page to register page within WP admin
     *
     * @unreleased enqueue form builder styles
     * @since 0.1.0
     *
     * @return void
     */
    public function __invoke()
    {
        $pageTitle = __('Visual Donation Form Builder', 'givewp');
        $menuTitle = __('Add Next Gen Form', 'givewp');
        $version = __('Beta', 'givewp');

        add_submenu_page(
            'edit.php?post_type=give_forms',
            "$pageTitle&nbsp;<span class='awaiting-mod'>$version</span>",
            "$menuTitle&nbsp;<span class='awaiting-mod'>$version</span>",
            'manage_options',
            FormBuilderRouteBuilder::SLUG,
            [$this, 'renderPage'],
            1
        );

        add_action("admin_print_styles", function () {
            if (FormBuilderRouteBuilder::isRoute()) {
                wp_enqueue_style('givewp-design-system-foundation');

                $this->loadGutenbergScripts();

                wp_enqueue_style(
                    '@givewp/form-builder/style-app',
                    GIVE_NEXT_GEN_URL . 'build/formBuilderApp.css'
                );

                wp_enqueue_style(
                    'givewp-form-builder-admin-styles',
                    GIVE_NEXT_GEN_URL . 'src/FormBuilder/resources/css/admin-form-builder.css'
                );
            }
        });
    }

    /**
     * Render page with scripts
     *
     * @unreleased enqueue form builder scripts from plugin root
     * @since 0.1.0
     *
     * @return void
     */
    public function renderPage()
    {
        $formBuilderViewModel = new FormBuilderViewModel();

        $donationFormId = abs($_GET['donationFormID']);

        // validate form exists before proceeding
        // TODO: improve on this validation
        if (!get_post($donationFormId)) {
            wp_die(__('Donation form does not exist.'));
        }

        $formBuilderStorage = (new EnqueueScript(
            '@givewp/form-builder/storage',
            'src/FormBuilder/resources/js/storage.js',
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ));

        $formBuilderStorage->dependencies(['jquery'])->registerLocalizeData(
            'storageData',
            $formBuilderViewModel->storageData($donationFormId)
        );

        $formBuilderStorage->loadInFooter()->enqueue();

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

        (new EnqueueScript(
            '@givewp/form-builder/script',
            $formBuilderViewModel->jsPathFromPluginRoot(),
            GIVE_NEXT_GEN_DIR,
            GIVE_NEXT_GEN_URL,
            'give'
        ))->loadInFooter()
            ->registerLocalizeData('formBuilderData', [
                'gateways' => array_values($builderPaymentGatewayData),
                'isRecurringEnabled' => defined('GIVE_RECURRING_VERSION') ? GIVE_RECURRING_VERSION : null,
                'recurringAddonData' => [
                    'isInstalled' => defined('GIVE_RECURRING_VERSION') ,
                ],
                'gatewaySettingsUrl' => admin_url('edit.php?post_type=give_forms&page=give-settings&tab=gateways'),
            ])
            ->enqueue();

        wp_localize_script('@givewp/form-builder/script', 'onboardingTourData', [
            'actionUrl' => admin_url('admin-ajax.php?action=givewp_tour_completed'),
            'autoStartTour' => !get_user_meta(get_current_user_id(), 'givewp-form-builder-tour-completed', true),
        ]);

        View::render('FormBuilder.admin-form-builder');
    }

    /**
     * @unreleased
     */
    public function loadGutenbergScripts()
    {
        // Gutenberg scripts
        wp_enqueue_script('wp-block-library');
        wp_enqueue_script('wp-format-library');
        wp_enqueue_script('wp-editor');

        // Gutenberg styles
        wp_enqueue_style('wp-edit-post');
        wp_enqueue_style('wp-format-library');

        // Keep Jetpack out of things
        add_filter(
            'jetpack_blocks_variation',
            function () {
                return 'no-post-editor';
            }
        );

        //wp_tinymce_inline_scripts();
        //wp_enqueue_editor();

        //do_action('enqueue_block_editor_assets');

        //add_action('wp_print_footer_scripts', array('_WP_Editors', 'print_default_editor_scripts'), 45);
    }
}
