import type {FieldProps} from '@givewp/forms/propTypes';

export default function Text({label, placeholder, fieldError, inputProps, validationRules}: FieldProps) {
    return (
        <label>
            <span>{label}</span>
            <input
                type="text"
                aria-invalid={fieldError ? 'true' : 'false'}
                placeholder={placeholder}
                {...inputProps}
                {...validationRules}
            />

            {fieldError && (
                <div className="error-message">
                    <p role="alert">{fieldError}</p>
                </div>
            )}
        </label>
    );
}
