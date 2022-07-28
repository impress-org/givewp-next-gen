const Select = ({id, label, options, onChange}) => {
    return <div className="givewp-form-block__select--container">
        <label className="givewp-form-block__select--label">
            <span>{label}</span>
            <div>
                <select name={id} id={id}
                        className="givewp-form-block__select"
                        onChange={onChange}>
                    {options.map(({label, value}) =>
                        <option value={value} key={value}>{label}</option>
                    )}
                </select>
            </div>
        </label>
    </div>
}

export default Select;
