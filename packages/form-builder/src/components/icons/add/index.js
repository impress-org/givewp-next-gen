const AddIcon = (props) => {
    return (
        <svg {...props} className="components-icon--add" width="32" height="32" viewBox="0 0 32 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            {!props.isPressed && (
                <>
                    <path d="M10 16H22" stroke="white" strokeWidth="1.5" />
                    <path d="M16 10L16 22" stroke="white" strokeWidth="1.5" />
                </>
            )}
            {!!props.isPressed && (
                <>
                    <path d="M11.7568 20.2426L20.2421 11.7574" strokeWidth="1.5" />
                    <path d="M11.7568 11.7574L20.2421 20.2426" strokeWidth="1.5" />
                </>
            )}
        </svg>
    );
};

export default AddIcon;
