<?php

namespace Give\NextGen\EmailPreview\Controllers;

class ShowEmailPreview
{
    public function __invoke(\WP_REST_Request $request)
    {
        $formId = $request->get_param('form_id');
        $emailType = $request->get_param('email_type');

        try {
            $emailNotification = $this->getEmailNotificationByType($emailType);
        } catch (\Exception $e) {
            return new \WP_REST_Response($e->getMessage(), 400);
        }

        $emailHeader = $request->get_param('email_heading') ?: $emailNotification->get_email_header( $formId );
        $emailMessage = $request->get_param('email_message') ?: $emailNotification->get_email_message( $formId );
        $emailTemplate = $request->get_param('email_template') ?: $emailNotification->get_email_template( $formId );
        $contentType = $request->get_param('content_type') ?: $emailNotification->get_email_content_type( $formId );

        Give()->emails->__set('html', true); // Show formatted text in browser even text/plain content type set for an email.
        Give()->emails->__set('content_type', $contentType);
        Give()->emails->__set('heading', $emailNotification->preview_email_template_tags($emailHeader));
        Give()->emails->__set('template', 'text/plain' !== $contentType ? $emailTemplate : 'none');

        $emailHtml = Give()->emails->build_email(
            $emailNotification->preview_email_template_tags(
                $emailMessage
            )
        );

        add_filter('give_preview_email_receipt_header', '__return_false'); // Disable hard-coded preview switcher.
        do_action( "give_{$emailType}_email_preview", $emailNotification );

        ob_clean();
        header('Content-Type: text/html; charset=UTF-8');
        echo apply_filters( "give_{$emailType}_email_preview_message",
            $emailHtml,
            $email_preview_data = apply_filters( "give_{$emailType}_email_preview_data", array() ),
            $emailNotification
        );
        exit;
    }

    /**
     * @param $type
     *
     * @return \Give_Email_Notification|void
     * @throws \Exception
     */
    protected function getEmailNotificationByType($type)
    {
        foreach(\Give_Email_Notifications::get_instance()->get_email_notifications() as $emailNotification) {
            if ( $type === $emailNotification->config['id'] ) {
                /* @var \Give_Email_Notification $emailNotification */
                return $emailNotification;
            }
        }

        throw new \Exception("Email notification not found for '$type'");
    }
}
