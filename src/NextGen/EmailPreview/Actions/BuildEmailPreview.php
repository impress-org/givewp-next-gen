<?php

namespace Give\NextGen\EmailPreview\Actions;

class BuildEmailPreview
{
    public function __construct(ApplyPreviewTemplateTags $applyPreviewTemplateTagsAction)
    {
        $this->applyPreviewTemplateTagsAction = $applyPreviewTemplateTagsAction;
    }

    public function __invoke($request)
    {
        $formId = $request->get_param('form_id');
        $emailType = $request->get_param('email_type');

        /**
         * The $emailNotification object is maintained for filter backward compatibility.
         */
        try {
            /** @var \Give_Email_Notification $emailNotification */
            $emailNotification = give(GetEmailNotificationByType::class)->__invoke($emailType);
        } catch (\Exception $e) {
            return new \WP_REST_Response($e->getMessage(), 400);
        }

        $emailHeader = apply_filters("give_{$emailType}_get_email_header", $request->get_param('email_heading'), $emailNotification, $formId);
        $emailMessage = apply_filters("give_{$emailType}_get_email_message", $request->get_param('email_message'), $emailNotification, $formId);
        $emailTemplate = apply_filters("give_{$emailType}_get_email_template", $request->get_param('email_template'), $emailNotification, $formId);
        $contentType = apply_filters("give_{$emailType}_get_email_content_type", $request->get_param('content_type'), $emailNotification, $formId);

        Give()->emails->__set('content_type', $contentType);
        Give()->emails->__set('heading', $this->applyPreviewTemplateTags($emailHeader));
        Give()->emails->__set('template', 'text/plain' !== $contentType ? $emailTemplate : 'none');

        add_filter('give_preview_email_receipt_header', '__return_false'); // Disable hard-coded preview switcher.
        do_action( "give_{$emailType}_email_preview", $emailNotification );

        return apply_filters( "give_{$emailType}_email_preview_message",
            Give()->emails->build_email($this->applyPreviewTemplateTags($emailMessage)),
            $email_preview_data = apply_filters( "give_{$emailType}_email_preview_data", array() ),
            $emailNotification
        );
    }

    protected function applyPreviewTemplateTags($emailHeader)
    {
        return $this->applyPreviewTemplateTagsAction->__invoke($emailHeader);
    }
}
