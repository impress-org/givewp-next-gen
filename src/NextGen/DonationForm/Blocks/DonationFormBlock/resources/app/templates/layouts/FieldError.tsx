export interface FieldErrorProps {
    error: string;
}

export default function FieldError({error}: FieldErrorProps) {
    if (!error) {
        return null;
    }

    return (
        <div className="error-message">
            <p role="alert">{error}</p>
        </div>
    );
}
