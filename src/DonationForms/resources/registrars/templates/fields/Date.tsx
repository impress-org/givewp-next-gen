import DatePicker from 'react-datepicker';
import {useEffect, useState} from '@wordpress/element';
import format from 'date-fns/format';

import {FieldHasDescriptionProps} from '@givewp/forms/propTypes';
import 'react-datepicker/dist/react-datepicker.css';

export default function Date({
    Label,
    ErrorMessage,
    fieldError,
    description,
    dateFormat,
    inputProps,
}: Omit<FieldHasDescriptionProps, 'placeholder'> & {dateFormat: string}) {
    const {useFormContext} = window.givewp.form.hooks;
    const {setValue} = useFormContext();
    const [date, setDate] = useState<Date>(new window.Date());

    dateFormat = dateFormat.replace('mm', 'MM');

    useEffect(() => {
        setValue(inputProps.name, format(date, dateFormat));
    }, [date]);

    return (
        <label>
            <Label />
            {description && <p style={{fontSize: '0.875rem', margin: '.25rem 0'}}>{description}</p>}
            <DatePicker dateFormat={dateFormat} selected={date} onChange={(date) => setDate(date)} />

            <ErrorMessage />
        </label>
    );
}
