<?php

namespace Give\NextGen\FormPage;

use Give\Helpers\Hooks;
use Give\NextGen\DonationForm\Actions\StoreBackwardsCompatibleFormMeta;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\Block as DonationFormBlock;
use Give\NextGen\DonationForm\Controllers\DonationConfirmationReceiptViewController;
use Give\NextGen\DonationForm\Controllers\DonationFormViewController;
use Give\NextGen\DonationForm\DataTransferObjects\DonationConfirmationReceiptViewRouteData;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormPreviewRouteData;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormViewRouteData;
use Give\NextGen\DonationForm\Routes\DonateRoute;
use Give\NextGen\Framework\Routes\Route;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{

    /*
     * @inheritdoc
     */
    public function register()
    {
        //
    }

    /*
     * @inheritdoc
     */
    public function boot()
    {
        add_filter( 'template_include', function($template) {
            global $post;

            if('give_forms' === $post->post_type && $post->post_content) {
                return plugin_dir_path(__FILE__) . 'NextGenFormPageTemplate.php';
            }

            return $template;
        }, 11);
    }
}
