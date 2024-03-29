<?php

namespace Give\FormBuilder\EmailPreview\Routes;

class RegisterEmailPreviewRoutes {
    /**
     * @since 0.4.0
     */
    public function __invoke()
    {
        foreach (include __DIR__ . '/routes.php' as $route => $args) {
            register_rest_route('givewp/form-builder/email-preview', $route, $args);
        }
    }
}