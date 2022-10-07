import {Field} from '@givewp/forms/types';

/**
 * Checks to see if the field is required and adds a * to the label
 *
 * @unreleased
 */
export default function addRequiredToFieldLabel(field: Field): Field {
    if (field.validationRules.required) {
        field.label = (
            <>
                {field.label}{' '}
                <span className="givewp-field-required" title="Field Required">
                    *
                </span>
            </>
        );
    }

    return field;
}
