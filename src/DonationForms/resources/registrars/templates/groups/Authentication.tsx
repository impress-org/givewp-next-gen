import {FC, useState} from 'react';
import {__} from '@wordpress/i18n';
import type {FieldProps} from '@givewp/forms/propTypes';
import {GroupProps} from '@givewp/forms/propTypes';
import getWindowData from '@givewp/forms/app/utilities/getWindowData';
import postData from '@givewp/forms/app/utilities/postData';
import getCurrentFormUrlData from '@givewp/forms/app/utilities/getCurrentFormUrlData';
import {useCallback} from '@wordpress/element';

const {originUrl, isEmbed, embedId} = getCurrentFormUrlData();

const handleLoginPageRedirected = () => {
    const formPageUrl = new URL(window.top.location.href);

    const isAuthRedirect =
        formPageUrl.searchParams.has('givewp-auth-redirect') &&
        formPageUrl.searchParams.get('givewp-auth-redirect') === 'true';

    if (isAuthRedirect) {
        const isEmbedRedirect =
            formPageUrl.searchParams.has('givewp-is-embed') &&
            formPageUrl.searchParams.get('givewp-is-embed') === 'true';
        const isThisEmbed =
            formPageUrl.searchParams.has('givewp-embed-id') &&
            formPageUrl.searchParams.get('givewp-embed-id') === embedId;

        if (isEmbedRedirect && isThisEmbed) {
            window.frameElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }
};

handleLoginPageRedirected();

interface AuthProps extends GroupProps {
    fields: {
        login: FC<FieldProps | {}>;
        password: FC<FieldProps | {}>;
    };
    required: boolean;
    isAuthenticated: boolean;
    loginRedirect: boolean;
    loginRedirectUrl: string;
    loginNotice: string;
    loginConfirmation: string;
}

export default function Authentication({
    fields: {login: Login, password: Password},
    required,
    isAuthenticated,
    loginRedirect,
    loginRedirectUrl,
    loginNotice,
    loginConfirmation,
}: AuthProps) {
    const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated);
    const [showLogin, setShowLogin] = useState<boolean>(required);
    const toggleShowLogin = () => setShowLogin(!showLogin);

    const handleLoginPageRedirect = useCallback(() => {
        const loginUrl = new URL(loginRedirectUrl);
        const redirectUrl = new URL(originUrl);

        redirectUrl.searchParams.append('givewp-auth-redirect', 'true');

        if (isEmbed) {
            redirectUrl.searchParams.append('givewp-is-embed', String(isEmbed));
            redirectUrl.searchParams.append('givewp-embed-id', embedId);
        }

        // use wp core login redirect param
        loginUrl.searchParams.set('redirect_to', redirectUrl.toString());

        window.top.location.assign(loginUrl);
    }, [loginRedirectUrl, isEmbed, embedId]);

    return (
        <>
            {isAuth && (
                <p style={{textAlign: 'center'}}>
                    <em>{loginConfirmation}</em>
                </p>
            )}
            {!isAuth && showLogin && (
                <LoginForm success={() => setIsAuth(true)} fail={(errorMessage) => alert(errorMessage)}>
                    <Login />
                    <Password />
                </LoginForm>
            )}
            {!isAuth && !showLogin && (
                <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    {loginRedirect ? (
                        <button type="button" onClick={handleLoginPageRedirect}>
                            {loginNotice}
                        </button>
                    ) : (
                        <LoginNotice onClick={toggleShowLogin}>{loginNotice}</LoginNotice>
                    )}
                </div>
            )}
        </>
    );
}

const LoginForm = ({children, success, fail}) => {
    const {authUrl} = getWindowData();
    const {useWatch, useFormContext} = window.givewp.form.hooks;
    const {setValue, getValues} = useFormContext();
    const {firstName, lastName, email} = getValues();

    const login = useWatch({name: 'login'});
    const password = useWatch({name: 'password'});

    const tryLogin = async (event) => {
        event.preventDefault();

        const {response} = await postData(authUrl, {
            login: login,
            password: password,
        });

        const {data: responseData} = await response.json();
        if (response.ok) {
            setValue('firstName', firstName || responseData.firstName);
            setValue('lastName', lastName || responseData.lastName);
            setValue('email', email || responseData.email);
            success();
        } else {
            console.log('here', responseData);
            fail(
                'authentication_error' === responseData.type
                    ? responseData.message
                    : __('Something went wrong. Please try or again or contact a site administrator.', 'givewp')
            );
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>{children}</div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    gap: '15px',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                }}
            >
                <button style={{width: 'auto'}} onClick={tryLogin}>
                    {__('Log In', 'givewp')}
                </button>
                <a href={'#'}>{__('Reset Password', 'givewp')}</a>
            </div>
        </div>
    );
};

const LoginNotice = ({children, onClick}) => {
    return (
        <button
            onClick={onClick}
            style={{width: 'auto', backgroundColor: 'transparent', border: 0, color: 'var(--wp-admin-theme-color)'}}
        >
            {children}
        </button>
    )
}
