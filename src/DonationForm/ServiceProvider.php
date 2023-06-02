<?php

namespace Give\DonationForm;

use Exception;
use Give\DonationForm\Actions\DispatchDonateControllerDonationCreatedListeners;
use Give\DonationForm\Actions\DispatchDonateControllerSubscriptionCreatedListeners;
use Give\DonationForm\Actions\StoreBackwardsCompatibleFormMeta;
use Give\DonationForm\Blocks\DonationFormBlock\Block as DonationFormBlock;
use Give\DonationForm\Controllers\DonationConfirmationReceiptViewController;
use Give\DonationForm\Controllers\DonationFormViewController;
use Give\DonationForm\DataTransferObjects\DonationConfirmationReceiptViewRouteData;
use Give\DonationForm\DataTransferObjects\DonationFormPreviewRouteData;
use Give\DonationForm\DataTransferObjects\DonationFormViewRouteData;
use Give\DonationForm\FormDesigns\ClassicFormDesign\ClassicFormDesign;
use Give\DonationForm\FormDesigns\DeveloperFormDesign\DeveloperFormDesign;
use Give\DonationForm\FormDesigns\MultiStepFormDesign\MultiStepFormDesign;
use Give\DonationForm\Repositories\DonationFormRepository;
use Give\DonationForm\Routes\DonateRoute;
use Give\DonationForm\Routes\ValidationRoute;
use Give\Framework\FormDesigns\Registrars\FormDesignRegistrar;
use Give\Framework\Routes\Route;
use Give\Helpers\Hooks;
use Give\Log\Log;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{

    /*
     * @inheritdoc
     */
    public function register()
    {
        give()->singleton('forms', DonationFormRepository::class);
    }

    /*
     * @inheritdoc
     */
    public function boot()
    {
        if (function_exists('register_block_type')) {
            Hooks::addAction('init', DonationFormBlock::class, 'register');
        }

        $this->registerRoutes();
        $this->registerFormDesigns();

        Hooks::addAction('givewp_donation_form_created', StoreBackwardsCompatibleFormMeta::class);
        Hooks::addAction('givewp_donation_form_updated', StoreBackwardsCompatibleFormMeta::class);

        $this->dispatchDonateControllerListeners();
    }

    /**
     * @since 0.1.0
     */
    private function registerRoutes()
    {
        /**
         * @since 0.1.0
         */
        Route::post('donate', DonateRoute::class);

        /**
         * @unreleased
         */
        Route::post('validate', ValidationRoute::class);

        /**
         * @since 0.1.0
         */
        Route::get('donation-form-view', static function (array $request) {
            $routeData = DonationFormViewRouteData::fromRequest($request);

            return give(DonationFormViewController::class)->show($routeData);
        });

        /**
         * @since 0.1.0
         */
        Route::get('donation-confirmation-receipt-view', static function (array $request) {
            $routeData = DonationConfirmationReceiptViewRouteData::fromRequest($request);

            return give(DonationConfirmationReceiptViewController::class)->show($routeData);
        });


        /**
         * @since 0.1.0
         */
        Route::post('donation-form-view-preview', static function (array $request) {
            $routeData = DonationFormPreviewRouteData::fromRequest($request);

            return give(DonationFormViewController::class)->preview($routeData);
        });
    }

    /**
     * @since 0.3.0
     */
    private function dispatchDonateControllerListeners()
    {
        Hooks::addAction(
            'givewp_donate_controller_donation_created',
            DispatchDonateControllerDonationCreatedListeners::class,
            '__invoke',
            10,
            2
        );

        Hooks::addAction(
            'givewp_donate_controller_subscription_created',
            DispatchDonateControllerSubscriptionCreatedListeners::class,
            '__invoke',
            10,
            3
        );
    }

    /**
     * @since 0.1.0
     */
    private function registerFormDesigns()
    {
        add_action('givewp_register_form_design', static function (FormDesignRegistrar $formDesignRegistrar) {
            try {
            $formDesignRegistrar->registerDesign(ClassicFormDesign::class);
            $formDesignRegistrar->registerDesign(DeveloperFormDesign::class);
            $formDesignRegistrar->registerDesign(MultiStepFormDesign::class);
            } catch (Exception $e) {
                Log::error('Error registering form designs', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        });
    }
}
