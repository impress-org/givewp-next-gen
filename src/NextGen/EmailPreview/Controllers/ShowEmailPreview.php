<?php

namespace Give\NextGen\EmailPreview\Controllers;

class ShowEmailPreview
{
    /**
     * @throws \Exception
     */
    public function __invoke(\WP_REST_Request $request)
    {
        header('Content-Type: text/html; charset=UTF-8');

        add_filter('give_preview_email_receipt_header', '__return_false'); // Disable hard-coded preview switcher.

        $email_type = $request->get_param('email_type');
        $form_id = empty( $_GET['form_id'] ) ? null : absint( $_GET['form_id'] );

        $emailNotification = $this->getEmailNotificationByType($email_type);
        $emailNotification->config['has_preview_header'] = false; // Disable the hard-coded donation switcher.

        Give()->emails->__set('html', true); // Show formatted text in browser even text/plain content type set for an email.
        Give()->emails->__set('form_id', $form_id);
        Give()->emails->__set( 'content_type', $emailNotification->get_email_content_type( $form_id ) );
        Give()->emails->__set( 'heading', $emailNotification->preview_email_template_tags( $emailNotification->get_email_header( $form_id ) ) );
        Give()->emails->__set( 'template',
            'text/plain' !== $emailNotification->config['content_type']
                ? $emailNotification->get_email_template( $form_id )
                : 'none'
        );

        $email_message = Give()->emails->build_email(
            $emailNotification->preview_email_template_tags(
                $emailNotification->get_email_message( $form_id )
            )
        );

        $email_preview_data = apply_filters( "give_{$email_type}_email_preview_data", array() );

        do_action( "give_{$email_type}_email_preview", $emailNotification );
        echo apply_filters( "give_{$email_type}_email_preview_message", $email_message, $email_preview_data, $emailNotification );
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

        if(!isset($emailNotification)) {
            throw new \Exception("Email notification not found for '$type'");
        }
    }
}
