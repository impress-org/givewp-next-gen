import {FieldProps} from '../index';

export default function TextArea({label, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <textarea {...inputProps} />
        </label>
    );
}
