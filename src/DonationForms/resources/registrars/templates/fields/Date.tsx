import DatePicker from 'react-datepicker';

import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../styles.module.scss';
import {Controller} from 'react-hook-form';

export default function Date({
    Label,
    ErrorMessage,
    fieldError,
    description,
    dateFormat,
    inputProps,
}: Omit<FieldHasDescriptionProps, 'placeholder'> & {dateFormat: string}) {
    const {useFormContext} = window.givewp.form.hooks;
    const {control} = useFormContext();
    const FieldDescription = window.givewp.form.templates.layouts.fieldDescription;

    dateFormat = dateFormat.replace('mm', 'MM');

    return (
        <label className={styles.dateField}>
            <Label />
            {description && <FieldDescription description={description} />}
            <Controller
                control={control}
                {...inputProps}
                render={({
                    field: {onChange, onBlur, value, name, ref},
                    fieldState: {invalid, isTouched, isDirty, error},
                    formState,
                }) => (
                    <DatePicker
                        ref={ref}
                        dateFormat={dateFormat}
                        selected={value}
                        onChange={onChange}
                        aria-invalid={invalid ? 'true' : 'false'}
                    />
                )}
            />

            <ErrorMessage />
        </label>
    );
}
