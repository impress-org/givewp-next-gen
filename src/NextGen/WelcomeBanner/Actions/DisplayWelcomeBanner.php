<?php

namespace Give\NextGen\WelcomeBanner\Actions;

use Give\Addon\View;

class DisplayWelcomeBanner
{
    protected $data = [
        'action' => 'givewp_next_gen_welcome_banner_dismiss',
        'nonce'  => '',
    ];

    public function __construct() {
        $this->data['nonce'] = wp_create_nonce( $this->data['action'] );
    }

    public function __invoke() {
        echo View::load('NextGen/WelcomeBanner.welcome-banner', $this->data);
    }
}
