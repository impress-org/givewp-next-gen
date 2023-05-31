<?php

namespace Give\Tests\Unit\VieModels;

use Exception;
use Give\FormBuilder\DataTransferObjects\EmailNotificationData;
use Give\FormBuilder\ValueObjects\FormBuilderRestRouteConfig;
use Give\FormBuilder\ViewModels\FormBuilderViewModel;
use Give\NextGen\DonationForm\Actions\GenerateDonationFormPreviewRouteUrl;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\Framework\FormDesigns\FormDesign;
use Give\NextGen\Framework\FormDesigns\Registrars\FormDesignRegistrar;
use Give\Tests\TestCase;
use Give\Tests\TestTraits\RefreshDatabase;

class FormBuilderViewModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @since 0.1.0
     *
     * @return void
     * @throws Exception
     */
    public function testShouldReturnStorageData()
    {
        $viewModel = new FormBuilderViewModel();
        /** @var DonationForm $mockForm */
        $mockForm = DonationForm::factory()->create();
        $formId = $mockForm->id;

        $this->assertSame(
            [
                'formId' => $formId,
                'resourceURL' => rest_url(FormBuilderRestRouteConfig::NAMESPACE . '/form/' . $formId),
                'previewURL' => (new GenerateDonationFormPreviewRouteUrl())($formId),
                'nonce' => wp_create_nonce('wp_rest'),
                'blockData' => $mockForm->blocks->toJson(),
                'settings' => $mockForm->settings->toJson(),
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
                    'isEnabled' => give_is_setting_enabled(give_get_option('forms_singular')),
                    // Note: Boolean values must be nested in an array to maintain boolean type, see \WP_Scripts::localize().
                    'permalink' => add_query_arg(['p' => $formId], site_url('?post_type=give_forms')),
                    'rewriteSlug' => get_post_type_object('give_forms')->rewrite['slug'],
                ],
                'gateways' => $viewModel->getGateways(),
                'gatewaySettingsUrl' => admin_url('edit.php?post_type=give_forms&page=give-settings&tab=gateways'),
                'isRecurringEnabled' => defined('GIVE_RECURRING_VERSION') ? GIVE_RECURRING_VERSION : null,
                'recurringAddonData' => [
                    'isInstalled' => defined('GIVE_RECURRING_VERSION'),
                ],
                'emailTemplateTags' => array_values(give()->email_tags->get_tags()),
                'emailNotifications' => array_map(static function ($notification) {
                    return EmailNotificationData::fromLegacyNotification($notification);
                }, apply_filters('give_email_notification_options_metabox_fields', array(), $formId)),
                'emailPreviewURL' => rest_url('givewp/next-gen/email-preview'),
                'emailDefaultAddress' => get_option('admin_email'),
            ],
            $viewModel->storageData($formId)
        );
    }
}
