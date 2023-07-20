import {UrlProps} from '@givewp/forms/propTypes';

export default function Url({Label, ErrorMessage, fieldError, placeholder, description, inputProps}: UrlProps) {
    return (
        <label>
            <Label />
            {description && <p style={{margin: '.25rem 0'}}>{description}</p>}
            <input type="text" aria-invalid={fieldError ? 'true' : 'false'} placeholder={placeholder} {...inputProps} />

            <ErrorMessage />
        </label>
    );
}
