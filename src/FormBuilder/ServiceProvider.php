<?php

namespace Give\FormBuilder;

use Give\Addon\View;
use Give\ServiceProviders\ServiceProvider as ServiceProviderInterface;

/**
 * @unreleased
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register()
    {
        //
    }

    /**
     * @inheritDoc
     */
    public function boot()
    {
        add_action( 'admin_menu', function (){
            add_submenu_page(
                'edit.php?post_type=give_forms',
                __( 'Form Builder', 'givewp' ),
                __( 'Form Builder', 'givewp' ),
                'manage_options',
                'givenburg',
                function() {
                    $manifest = json_decode( file_get_contents( GIVE_NEXT_GEN_DIR . 'packages/form-builder/build/asset-manifest.json' ) );
                    list( $css, $js ) = $manifest->entrypoints;

                    View::render( 'FormBuilder.admin-form-builder', [
                        'shadowDomStyles' => file_get_contents( trailingslashit(GIVE_NEXT_GEN_DIR) . 'packages/form-builder/build/' . $css ),
                    ]);

                    wp_enqueue_script( '@givewp/form-builder/storage', trailingslashit(GIVE_NEXT_GEN_URL) . 'src/FormBuilder/resources/js/storage.js' );

                    wp_enqueue_script( '@givewp/form-builder/script', trailingslashit(GIVE_NEXT_GEN_URL) . 'packages/form-builder/build/' . $js, [], false, true );
                    wp_add_inline_script( '@givewp/form-builder/script', "
                        document.getElementById('app').attachShadow({mode: 'open'})
                            .appendChild( document.getElementById('root') )
                            .appendChild( document.getElementById('shadowDomStyles') )
                    ");
                },
                1
            );
        } );
    }
}
