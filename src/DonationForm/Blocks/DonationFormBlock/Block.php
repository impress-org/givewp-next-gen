<?php

namespace Give\DonationForm\Blocks\DonationFormBlock;

use Give\DonationForm\Blocks\DonationFormBlock\Controllers\BlockRenderController;
use Give\Log\Log;

class Block
{

    /**
     * @since 0.1.0
     *
     * @return void
     */
    public function register()
    {
        Log::debug('Registering Donation Form block', ['block_type' => __DIR__]);
        
        register_block_type(
            __DIR__,
            [
                'render_callback' => [(new BlockRenderController()), 'render']
            ]
        );
    }
}
