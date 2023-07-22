import Select from 'react-select';
import {useEffect, useState} from '@wordpress/element';

import type {SelectFieldProps} from '@givewp/forms/propTypes';
import styles from '../styles.module.scss';

export default function MultiSelect({
    Label,
    ErrorMessage,
    fieldError,
    defaultValue,
    description,
    fieldType,
    options,
    inputProps,
}: SelectFieldProps) {
    const {useFormContext} = window.givewp.form.hooks;
    const {setValue} = useFormContext();
    const [selected, setSelected] = useState(defaultValue);

    useEffect(() => {
        setValue(inputProps.name, selected.join(' | '));
    }, [selected]);

    return (
        <fieldset className={styles.multiSelectField}>
            <legend>
                <Label />
                {description && (
                    <p style={{fontSize: '0.875rem', margin: 'var(--givewp-spacing-1) 0'}}>{description}</p>
                )}
            </legend>
            {fieldType === 'dropdown' ? (
                <Select
                    options={options}
                    value={options.filter(({value}) => selected.includes(value))}
                    isMulti={true}
                    isClearable={true}
                    isSearchable={false}
                    className="givewp-fields-multiSelect__input"
                    classNamePrefix="givewp-fields-multiSelect"
                    onChange={(selected) => setSelected(selected.map(({value}) => value))}
                />
            ) : (
                <div className="givewp-fields-checkbox__options">
                    {options.map(({value, label}, index) => (
                        <div key={index} className="givewp-fields-checkbox__option--container">
                            <input
                                type="checkbox"
                                name={inputProps.name}
                                value={value}
                                checked={selected.includes(value)}
                                onChange={(event) => {
                                    const {value, checked} = event.target;

                                    if (checked) {
                                        setSelected((prevSelected) => [...prevSelected, value]);
                                    } else {
                                        setSelected((prevSelected) => prevSelected.filter((item) => item !== value));
                                    }
                                }}
                            />
                            <label htmlFor={inputProps.name}>{label}</label>
                        </div>
                    ))}
                </div>
            )}

            <ErrorMessage />
        </fieldset>
    );
}
