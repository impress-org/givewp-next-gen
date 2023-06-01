import {useState} from "react";
import {__} from "@wordpress/i18n";
import type {FieldProps} from '@givewp/forms/propTypes';
import {useFormState} from "react-hook-form";
import login from "@givewp/form-builder/src/blocks/fields/login";

interface AuthFieldProps extends FieldProps {
    required: boolean;
    loginRedirect: boolean
    loginRedirectUrl: string;
    loginNotice:  string;
    loginConfirmation: string;
}

export default function Authentication({
   Label, ErrorMessage, placeholder, fieldError, inputProps,
   required, loginRedirect, loginRedirectUrl, loginNotice, loginConfirmation,
}: AuthFieldProps) {

    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(required);
    const toggleShowLogin = () => setShowLogin(!showLogin);

    return (
        <>
            {isAuth && (
                <p style={{textAlign: 'center'}}>
                    <em>{loginConfirmation}</em>
                </p>
            )}
            {!isAuth && showLogin && (
                <LoginForm onLogin={() => {
                    setIsAuth(true)
                }} />
            )}
            {!isAuth && !showLogin && (
                <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    {loginRedirect
                        ? <a href={loginRedirectUrl}>{loginNotice}</a>
                        : <LoginNotice onClick={toggleShowLogin}>{loginNotice}</LoginNotice>
                    }
                </div>
            )}
        </>
    );
}

const LoginForm = ({onLogin}) => {

    const {useWatch, useFormContext, useCurrencyFormatter} = window.givewp.form.hooks;
    const {setValue} = useFormContext();

    const tryLogin = () => {
        setValue('firstName', 'Kyle');
        setValue('lastName', 'Johnson');
        setValue('email', 'kyle.johnson@givewp.com');
        onLogin();
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>

                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <label>{__('Login', 'givewp')}</label>
                    <input type="text" />
                </div>

                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <label>{__('Password', 'givewp')}</label>
                    <input type="password" />
                </div>

            </div>

            <div style={{display: 'flex', flexDirection: 'row-reverse', gap: '15px', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <button style={{width: 'auto'}} onClick={tryLogin}>{__('Log In', 'givewp')}</button>
                <a href={'#'}>{__('Reset Password', 'givewp')}</a>
            </div>

        </div>
    )
}

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
