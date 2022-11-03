import {ReactNode} from 'react';

export interface FieldLabelProps {
    label: string;
    required: boolean;
}

export default function FieldLabel({label, required}: FieldLabelProps): ReactNode {
    return (
        <span>
            {label}
            {required && (
                <>
                    {' '}
                    <span className="givewp-field-required" title="Field Required">
                        *
                    </span>
                </>
            )}
        </span>
    );
}
