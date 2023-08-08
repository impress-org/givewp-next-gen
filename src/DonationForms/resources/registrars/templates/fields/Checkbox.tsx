import type {CheckboxProps} from '@givewp/forms/propTypes';

/**
 * @unreleased added helpText tooltip
 * @since 0.4.0
 */
export default function Checkbox({Label, ErrorMessage, value, helpText, fieldError, inputProps}: CheckboxProps) {
    return (
        <label>
            <input type="checkbox" value={value} aria-invalid={fieldError ? 'true' : 'false'} {...inputProps} />
            {helpText ? (
                <span data-tooltip={helpText}>
                    <Label />
                </span>
            ) : (
                <Label />
            )}

            <ErrorMessage />
        </label>
    );
}
