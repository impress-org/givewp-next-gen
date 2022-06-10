import {FieldProps} from '../index';

export default function Text({label, inputProps}: FieldProps) {
    return (
        <label>
            {label}
            <input type="text" {...inputProps} />
        </label>
    );
}
