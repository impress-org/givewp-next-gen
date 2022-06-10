import {FieldProps} from '../index';

export default function Email({label, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="email" {...inputProps} />
        </label>
    );
}
