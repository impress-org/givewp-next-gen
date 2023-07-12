import {ErrorMessage} from '@hookform/error-message';
import type {GatewayFieldProps, GatewayOptionProps} from '@givewp/forms/propTypes';
import {ErrorBoundary} from 'react-error-boundary';
import {__} from '@wordpress/i18n';
import {createInterpolateElement} from '@wordpress/element';

function GatewayFieldsErrorFallback({error, resetErrorBoundary}) {
    return (
        <div role="alert">
            <p>
                {__(
                    'An error occurred while loading the gateway fields.  Please notify the site administrator.  The error message is:',
                    'give'
                )}
            </p>
            <pre style={{padding: '0.5rem'}}>{error.message}</pre>
            <button type="button" onClick={resetErrorBoundary}>
                {__('Reload form', 'give')}
            </button>
        </div>
    );
}

const TestModeNotice = () => {
    return (
        <div className={'givewp-test-mode-notice'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9H12.01C12.5623 9 13.01 8.55228 13.01 8C13.01 7.44772 12.5623 7 12.01 7H12ZM13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z"
                    fill="#F29718"
                />
            </svg>{' '}
            <p>
                {createInterpolateElement(
                    __(
                        'Test mode is <strong>enabled</strong>. While in test mode no live donations are processed.',
                        'give'
                    ),
                    {
                        strong: <strong />,
                    }
                )}
            </p>
        </div>
    );
};

export default function Gateways({isTestMode, inputProps, gateways}: GatewayFieldProps) {
    const {errors} = window.givewp.form.hooks.useFormState();

    return (
        <>
            {gateways.length > 0 ? (
                <>
                    {isTestMode && <TestModeNotice />}
                    <ul style={{listStyleType: 'none', padding: 0}}>
                        {gateways.map((gateway, index) => (
                            <GatewayOption gateway={gateway} index={index} key={gateway.id} inputProps={inputProps} />
                        ))}
                    </ul>
                </>
            ) : (
                <em>
                    {__(
                        'No gateways have been enabled yet.  To get started accepting donations, enable a compatible payment gateway in your settings.',
                        'give'
                    )}
                </em>
            )}

            <ErrorMessage
                errors={errors}
                name={'gatewayId'}
                render={({message}) => <span className="give-next-gen__error-message">{message}</span>}
            />
        </>
    );
}

function GatewayOption({gateway, index, inputProps}: GatewayOptionProps) {
    return (
        <li>
            <input type="radio" value={gateway.id} id={gateway.id} defaultChecked={index === 0} {...inputProps} />
            <label htmlFor={gateway.id}> Donate with {gateway.label}</label>
            <div className="givewp-fields-payment-gateway">
                <ErrorBoundary
                    FallbackComponent={GatewayFieldsErrorFallback}
                    onReset={() => {
                        window.location.reload();
                    }}
                >
                    <gateway.Fields />
                </ErrorBoundary>
            </div>
        </li>
    );
}
