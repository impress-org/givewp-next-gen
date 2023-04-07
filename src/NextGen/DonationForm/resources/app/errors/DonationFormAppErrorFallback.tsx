import {__} from "@wordpress/i18n";

/**
 * @unreleased
 */
export default function DonationFormAppErrorFallback({error, resetErrorBoundary}) {
    return (
        <div role="alert">
            <p>
                {__(
                    'An error occurred in the form.  Please notify the site administrator.  The error message is:',
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
