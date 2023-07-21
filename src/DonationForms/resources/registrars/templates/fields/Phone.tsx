import InputMask from 'react-input-mask';

import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';

export default function Phone({
    Label,
    ErrorMessage,
    fieldError,
    description,
    phoneFormat,
    inputProps,
}: Omit<FieldHasDescriptionProps, 'placeholder'> & {phoneFormat: string}) {
    return (
        <label>
            <Label />
            {description && <p style={{fontSize: '0.875rem', margin: '.25rem 0'}}>{description}</p>}
            {phoneFormat === 'domestic' ? (
                <InputMask type={'phone'} {...inputProps} mask={'(999) 999-9999'} />
            ) : (
                <input type={'phone'} {...inputProps} />
            )}

            <ErrorMessage />
        </label>
    );
}
