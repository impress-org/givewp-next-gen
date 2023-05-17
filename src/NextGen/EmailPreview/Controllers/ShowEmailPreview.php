<?php

namespace Give\NextGen\EmailPreview\Controllers;

use Give\NextGen\EmailPreview\Actions\BuildEmailPreview;

class ShowEmailPreview
{
    public function __invoke(\WP_REST_Request $request)
    {
        Give()->emails->__set('html', true); // Show formatted text in browser even text/plain content type set for an email.

        ob_clean();
        header('Content-Type: text/html; charset=UTF-8');
        echo (new BuildEmailPreview())($request);
        exit;
    }
}
