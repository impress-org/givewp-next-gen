import {ChangeEventHandler} from "react";
import {Option} from '../types';

export default function Select({id, label, defaultValue, options, onChange}: PropTypes) {
    if (options === null) {
        return (
            <div>
                <p>No forms were found using the GiveWP form builder.</p>
            </div>
        )
    }

    return <div className="givewp-form-block__select--container">
        <label className="givewp-form-block__select--label">
            <span>{label}</span>
            <div>
                <select name={id} id={id}
                        className="givewp-form-block__select"
                        value={defaultValue}
                        onChange={onChange}>
                    {options.map(({label, value}) =>
                        <option value={value} key={value}>{label}</option>
                    )}
                </select>
            </div>
        </label>
    </div>
}

type PropTypes = {
    id: string;
    label: string;
    options: Option[];
    defaultValue: string;
    onChange: ChangeEventHandler
}
