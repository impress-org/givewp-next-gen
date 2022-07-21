import {FieldProps} from '../index';
import classNames from "classnames";

export default function Email({label, fieldError, inputProps}: FieldProps) {
    const {name} = inputProps;

    return (
        <div className={classNames('input-container', {'error': fieldError})}>
            <label htmlFor={name}>
                {label}
            </label>

            <input className={classNames('input-email', {'error': fieldError})} type="email"
                   id={name} aria-invalid={fieldError ? "true" : "false"} {...inputProps} />

            <p className={classNames("input-error-message", {'visible': fieldError})}>{fieldError}</p>
        </div>
    );
}
