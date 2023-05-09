<?php

namespace Give\NextGen\EmailPreview\Actions;

class GetEmailNotificationByType
{
    /**
     * @param $type
     *
     * @return \Give_Email_Notification|void
     * @throws \Exception
     */
    public function __invoke($type)
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
