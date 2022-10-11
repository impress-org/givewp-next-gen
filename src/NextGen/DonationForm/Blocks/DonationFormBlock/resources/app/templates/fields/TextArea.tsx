import type {FieldProps} from '@givewp/forms/propTypes';

export default function TextArea({requiredLabel, placeholder, fieldError, inputProps}: FieldProps) {
    return (
        <label>
            {requiredLabel}
            <textarea {...inputProps} placeholder={placeholder} />
            {fieldError && (
                <div className="error-message">
                    <p role="alert">{fieldError}</p>
                </div>
            )}
        </label>
    );
}
