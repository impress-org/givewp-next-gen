/**
 * Conditionally renders a field's error message if a message is present.
 *
 * @unreleased
 */
import {FieldErrorProps} from '@givewp/forms/propTypes';

export default function FieldError({error}: FieldErrorProps) {
    if (!error) {
        return null;
    }

    return (
        <div className="error-message">
            <p role="alert">{error}</p>
        </div>
    );
}
