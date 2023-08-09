<?php

namespace Give\FormBuilder;

use Give\FormBuilder\Actions\ConvertGlobalDefaultOptionsToDefaultBlocks;
use Give\FormBuilder\Actions\DequeueAdminScriptsInFormBuilder;
use Give\FormBuilder\Actions\DequeueAdminStylesInFormBuilder;
use Give\FormBuilder\Actions\UpdateEmailSettingsMeta;
use Give\FormBuilder\Actions\UpdateEmailTemplateMeta;
use Give\FormBuilder\Actions\UpdateFormGridMeta;
use Give\FormBuilder\EmailPreview\Routes\RegisterEmailPreviewRoutes;
use Give\FormBuilder\Routes\CreateFormRoute;
use Give\FormBuilder\Routes\EditFormRoute;
use Give\FormBuilder\Routes\RegisterFormBuilderPageRoute;
use Give\FormBuilder\Routes\RegisterFormBuilderRestRoutes;
use Give\Framework\FieldsAPI\DonationForm;
use Give\Helpers\Hooks;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @since 0.1.0
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        Hooks::addAction('rest_api_init', RegisterFormBuilderRestRoutes::class);

        Hooks::addAction('rest_api_init', RegisterEmailPreviewRoutes::class);

        Hooks::addAction('admin_init', CreateFormRoute::class);

        Hooks::addAction('admin_init', EditFormRoute::class);

        Hooks::addAction('admin_menu', RegisterFormBuilderPageRoute::class);

        Hooks::addAction('admin_print_scripts', DequeueAdminScriptsInFormBuilder::class);

        Hooks::addAction('admin_print_styles', DequeueAdminStylesInFormBuilder::class);

        /** Integrates the "Add v3 Form" button with the Donation Forms table. */
        add_action('admin_enqueue_scripts', static function () {
            wp_localize_script('give-admin-donation-forms', 'GiveNextGen', [
                'newFormUrl' => FormBuilderRouteBuilder::makeCreateFormRoute()->getUrl(),
            ]);
        });

        add_action('givewp_form_builder_updated', static function (DonationForm $form) {
            give(UpdateFormGridMeta::class)->__invoke($form);
            give(UpdateEmailSettingsMeta::class)->__invoke($form);
            give(UpdateEmailTemplateMeta::class)->__invoke($form);
        });


        Hooks::addAction('givewp_form_builder_new_form', ConvertGlobalDefaultOptionsToDefaultBlocks::class);

        $this->setupOnboardingTour();
    }

    protected function setupOnboardingTour()
    {
        add_action('wp_ajax_givewp_tour_completed', static function () {
            add_user_meta(get_current_user_id(), 'givewp-form-builder-tour-completed', time(), true);
        });
    }
}
