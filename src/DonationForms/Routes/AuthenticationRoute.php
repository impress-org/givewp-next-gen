<?php

namespace Give\DonationForm\Routes;

use Give\Framework\PaymentGateways\Traits\HandleHttpResponses;
use Give\DonationForm\DataTransferObjects\AuthenticationData;
use Give\DonationForm\DataTransferObjects\UserData;
use WP_User;

/**
 * @unreleased
 */
class AuthenticationRoute
{
    use HandleHttpResponses;

    /**
     * @unreleased
     *
     * @return void
     */
    public function __invoke(array $request)
    {
        $user = $this->authenticate(
            AuthenticationData::fromRequest($request)
        );

        wp_send_json_success(UserData::fromUser($user));

        exit;
    }

    /**
     * @unreleased
     *
     * @return WP_User
     */
    protected function authenticate(AuthenticationData $auth): WP_User
    {
        $userOrError = wp_signon([
            'user_login' => $auth->login,
            'user_password' => $auth->password,
        ]);

        if( is_wp_error( $userOrError ) ) {
            wp_send_json_error([
                'type' => 'authentication_error',
                'message' => __('The login/password does not match or is incorrect.', 'givewp'),
            ], 401);
            exit;
        }

        return $userOrError;
    }
}
