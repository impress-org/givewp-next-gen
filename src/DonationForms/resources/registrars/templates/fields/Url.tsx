import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';

export default function Url({
    Label,
    ErrorMessage,
    fieldError,
    placeholder,
    description,
    inputProps,
}: FieldHasDescriptionProps) {
    return (
        <label>
            <Label />
            {description && <p style={{fontSize: '0.875rem', margin: '.25rem 0'}}>{description}</p>}
            <input type="text" aria-invalid={fieldError ? 'true' : 'false'} placeholder={placeholder} {...inputProps} />

            <ErrorMessage />
        </label>
    );
}
