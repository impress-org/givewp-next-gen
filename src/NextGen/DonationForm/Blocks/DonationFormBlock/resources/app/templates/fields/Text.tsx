import type {FieldProps} from '@givewp/forms/propTypes';

export default function Text({requiredLabel, placeholder, fieldError, inputProps, validationRules}: FieldProps) {
    return (
        <label>
            <span>{requiredLabel}</span>
            <input type="text" aria-invalid={fieldError ? 'true' : 'false'} placeholder={placeholder} {...inputProps} />

            {fieldError && (
                <div className="error-message">
                    <p role="alert">{fieldError}</p>
                </div>
            )}
        </label>
    );
}
