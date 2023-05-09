<?php

namespace Give\NextGen\EmailPreview\Controllers;

use Give\NextGen\EmailPreview\Actions\BuildEmailPreview;

class SendEmailPreview
{
    public function __invoke(\WP_REST_Request $request)
    {
        $email = $request->get_param('email_address');
        $subject = $request->get_param('email_subject');
        $message = give(BuildEmailPreview::class)->__invoke($request);

        $sent = wp_mail( $email, $subject, $message );

        ob_clean();
        return new \WP_REST_Response($sent, 200);
    }
}
