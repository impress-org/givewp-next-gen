<?php

namespace Give\NextGen\EmailPreview;

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
//        add_filter('give_preview_email_receipt_header', '__return_false');
    }
}
