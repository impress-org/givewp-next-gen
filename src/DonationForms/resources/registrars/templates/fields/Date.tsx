import {DateProps} from '@givewp/forms/propTypes';

export default function Date({Label, ErrorMessage, fieldError, placeholder, description, inputProps}: DateProps) {
    return (
        <label>
            <Label />
            {description && <p style={{fontSize: '0.875rem', margin: '.25rem 0'}}>{description}</p>}
            <input type="date" aria-invalid={fieldError ? 'true' : 'false'} placeholder={placeholder} {...inputProps} />

            <ErrorMessage />
        </label>
    );
}
