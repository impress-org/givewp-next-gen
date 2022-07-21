import {FieldProps} from '../index';
import classNames from 'classnames';

export default function Text({label, fieldError, inputProps}: FieldProps) {
    const {name} = inputProps;

    return (
        <div className={classNames('input-container', {'error': fieldError})}>
            <label htmlFor={name}>
                {label}
            </label>

            <input className={classNames('input-text', {'error': fieldError})} type="text" id={name}
                   aria-invalid={fieldError ? "true" : "false"} {...inputProps} />

            <p className={classNames("input-error-message", {'visible': fieldError})}>{fieldError}</p>
        </div>
    );
}
