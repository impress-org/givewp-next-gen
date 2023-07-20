import type {RadioFieldProps} from '@givewp/forms/propTypes';

export default function Radio({Label, ErrorMessage, options, description, inputProps}: RadioFieldProps) {
    return (
        options.length > 0 && (
            <fieldset>
                <legend>
                    <Label />
                    {description && (
                        <p style={{fontSize: '0.875rem', margin: 'var(--givewp-spacing-1) 0'}}>{description}</p>
                    )}
                </legend>
                <div className="givewp-fields-radio__options">
                    {options.map(({value, label}, index) => (
                        <div key={index} className="givewp-fields-radio__option--container">
                            <input type="radio" name={inputProps.name} value={value} {...inputProps} />
                            <label htmlFor={inputProps.name}>{label}</label>
                        </div>
                    ))}
                </div>

                <ErrorMessage />
            </fieldset>
        )
    );
}
