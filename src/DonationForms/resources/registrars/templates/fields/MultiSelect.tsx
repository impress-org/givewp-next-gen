import Select from 'react-select';
import {useState} from '@wordpress/element';

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
    const FieldDescription = window.givewp.form.templates.layouts.fieldDescription;

    // useEffect(() => {
    //     if (selected) {
    //         setValue(inputProps.name, selected);
    //     }
    // }, [selected]);

    return (
        <fieldset className={styles.multiSelectField}>
            <label>
                <Label />
                {description && <FieldDescription description={description} />}
            </label>
            {fieldType === 'dropdown' ? (
                <Select
                    options={options}
                    value={selected && options.filter(({value}) => selected.includes(value))}
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
                                {...inputProps}
                                value={value}
                                //checked={selected ? selected.includes(value) : false}
                                // onChange={(event) => {
                                //     const {value, checked} = event.target;
                                //
                                //     if (checked) {
                                //         setSelected((prevSelected) => [...prevSelected, value]);
                                //     } else {
                                //         setSelected((prevSelected) => prevSelected.filter((item) => item !== value));
                                //     }
                                // }}
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
