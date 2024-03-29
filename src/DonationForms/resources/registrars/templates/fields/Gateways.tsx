import {ErrorMessage} from '@hookform/error-message';
import type {GatewayFieldProps, GatewayOptionProps} from '@givewp/forms/propTypes';
import {ErrorBoundary} from 'react-error-boundary';
import {__} from '@wordpress/i18n';
import {useEffect, useMemo} from 'react';
import {createInterpolateElement} from '@wordpress/element';

/**
 * @since 0.6.0
 */
function GatewayMissingMessage({currencyNotSupported}: {currencyNotSupported?: boolean}) {
    return (
        <em>
            {currencyNotSupported
                ? __(
                      'The selected currency is not supported by any of the available payment gateways.  Please select a different currency or contact the site administrator for assistance.',
                      'give'
                  )
                : __(
                      'No gateways have been enabled yet.  To get started accepting donations, enable a compatible payment gateway in your settings.',
                      'give'
                  )}
        </em>
    );
}

/**
 * @since 0.1.0
 */
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

/**
 * @since 0.6.0
 */
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

/**
 * @since 0.6.0 update to support currency switcher settings and test mode notice
 * @since 0.1.0
 */
export default function Gateways({isTestMode, defaultValue, inputProps, gateways}: GatewayFieldProps) {
    const {useFormState, useWatch, useFormContext, useDonationFormSettings} = window.givewp.form.hooks;
    const {errors} = useFormState();
    const {setValue} = useFormContext();
    const {currencySwitcherSettings} = useDonationFormSettings();

    const currency = useWatch({name: 'currency'});

    // filter gateway options if currency switcher settings are present
    const gatewayOptions = useMemo(() => {
        if (currencySwitcherSettings.length <= 1) {
            return gateways;
        }

        const currencySwitcherSetting = currencySwitcherSettings.find(({id}) => id === currency);

        if (!currencySwitcherSetting) {
            return [];
        }

        return gateways.filter(({id}) => currencySwitcherSetting.gateways.includes(id));
    }, [currency]);

    // reset the default /selected gateway based on the gateway options available
    useEffect(() => {
        if (gatewayOptions.length > 0) {
            const optionsDefaultValue = gatewayOptions.includes(defaultValue) ? defaultValue : gatewayOptions[0].id;

            setValue(inputProps.name, optionsDefaultValue);
        } else {
            setValue(inputProps.name, null);
        }
    }, [gatewayOptions]);

    return (
        <>
            {gatewayOptions.length > 0 ? (
                <>
                    {isTestMode && <TestModeNotice />}
                    <ul style={{listStyleType: 'none', padding: 0}}>
                        {gatewayOptions.map((gateway, index) => (
                            <GatewayOption
                                gateway={gateway}
                                defaultChecked={gateway.id === defaultValue}
                                key={gateway.id}
                                inputProps={inputProps}
                            />
                        ))}
                    </ul>
                </>
            ) : (
                <GatewayMissingMessage currencyNotSupported={currencySwitcherSettings.length > 1} />
            )}

            <ErrorMessage
                errors={errors}
                name={'gatewayId'}
                render={({message}) => <span className="give-next-gen__error-message">{message}</span>}
            />
        </>
    );
}

/**
 * @since 0.6.0 replace index prop with defaultChecked
 * @since 0.1.0
 */
function GatewayOption({gateway, defaultChecked, inputProps}: GatewayOptionProps) {
    return (
        <li>
            <input type="radio" value={gateway.id} id={gateway.id} defaultChecked={defaultChecked} {...inputProps} />
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
