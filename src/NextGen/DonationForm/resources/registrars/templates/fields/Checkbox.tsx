import type {CheckboxFieldProps} from '@givewp/forms/propTypes';

export default function Checkbox({Label, ErrorMessage, options, inputProps}: CheckboxFieldProps) {
    return (
        options.length > 0 && (
            <fieldset>
                <legend>
                    <Label />
                </legend>
                <div className="givewp-fields-checkbox__options">
                    {options.map(({value, label}, index) => (
                        <div key={index} className="givewp-fields-checkbox__option--container">
                            <input type="checkbox" name={inputProps.name} value={value} {...inputProps} />
                            <label htmlFor={inputProps.name}>{label}</label>
                        </div>
                    ))}
                </div>

                <ErrorMessage />
            </fieldset>
        )
    );
}
