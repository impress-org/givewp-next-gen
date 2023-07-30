import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';

export default function File({Label, ErrorMessage, fieldError, description, inputProps}: FieldHasDescriptionProps) {
    const FieldDescription = window.givewp.form.templates.layouts.fieldDescription;

    return (
        <label>
            <Label />
            {description && <FieldDescription description={description} />}
            <input
                type="file"
                accept="image/png, image/jpeg"
                aria-invalid={fieldError ? 'true' : 'false'}
                {...inputProps}
            />

            <ErrorMessage />
        </label>
    );
}
