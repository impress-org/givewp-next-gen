import {ReactNode} from 'react';

/**
 * Generates a label with the required indicator
 *
 * @unreleased
 */
export default function generateRequiredLabel(label: string, required: boolean): ReactNode | string {
    if (required) {
        return (
            <>
                {label}{' '}
                <span className="givewp-field-required" title="Field Required">
                    *
                </span>
            </>
        );
    }

    return label;
}
