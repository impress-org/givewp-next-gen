import type {FieldProps} from '@givewp/forms/propTypes';

export default function Select({label, fieldError, inputProps}: FieldProps) {
    return (
        <label>
            <span>{label}</span>
            <select aria-invalid={fieldError ? 'true' : 'false'} {...inputProps}>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
            </select>

            {fieldError && (
                <div className="error-message">
                    <p role="alert">{fieldError}</p>
                </div>
            )}
        </label>
    );
}
