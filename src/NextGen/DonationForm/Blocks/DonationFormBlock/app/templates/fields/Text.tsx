import {FieldProps} from '../index';

export default function Text({label, fieldError, inputProps}: FieldProps) {
    return (
        <label>
            <span>{label}</span>
            <input type="text" aria-invalid={fieldError ? "true" : "false"} {...inputProps} />

            <div className="error-message">
                {fieldError && <p role="alert">{fieldError}</p>}
            </div>
        </label>
    );
}
