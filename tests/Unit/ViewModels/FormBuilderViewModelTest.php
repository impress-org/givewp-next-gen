<?php

namespace Give\Tests\Unit\VieModels;

use Exception;
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

        $storageData = $viewModel->storageData($formId);

        foreach([
            'formId',
            'resourceURL',
            'previewURL',
            'nonce',
            'blockData',
            'settings',
            'currency',
            'formDesigns',
            'formPage',
            'gateways',
            'gatewaySettingsUrl',
            'isRecurringEnabled',
            'recurringAddonData',
            'emailTemplateTags',
            'emailNotifications',
            'emailPreviewURL',
        ] as $key) {
            $this->assertArrayHasKey($key, $storageData);
        }

        foreach([
            'isEnabled',
            'permalink',
            'rewriteSlug',
        ] as $key) {
            $this->assertArrayHasKey($key, $storageData['formPage']);
        }

        $this->assertArrayHasKey('isInstalled', $storageData['recurringAddonData']);
    }
}
