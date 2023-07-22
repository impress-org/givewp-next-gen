import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';

export default function File({Label, ErrorMessage, fieldError, description, inputProps}: FieldHasDescriptionProps) {
    return (
        <label>
            <Label />
            {description && <p style={{fontSize: '0.875rem', margin: '.25rem 0'}}>{description}</p>}
            <input type="file" aria-invalid={fieldError ? 'true' : 'false'} {...inputProps} />

            <ErrorMessage />
        </label>
    );
}
