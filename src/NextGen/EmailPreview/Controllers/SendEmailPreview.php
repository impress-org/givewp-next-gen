<?php

namespace Give\NextGen\EmailPreview\Controllers;

use Give\NextGen\EmailPreview\Actions\BuildEmailPreview;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Send email preview.
 *
 * @unreleased
 */
class SendEmailPreview
{
    /**
     * @unreleased
     *
     * @param WP_REST_Request $request
     *
     * @return WP_REST_Response
     */
    public function __invoke(WP_REST_Request $request): WP_REST_Response
    {
        $email = $request->get_param('email_address');
        $subject = $request->get_param('email_subject');
        $message = give(BuildEmailPreview::class)->__invoke($request);

        $sent = wp_mail( $email, $subject, $message );

        ob_clean();
        return new WP_REST_Response($sent, 200);
    }
}
