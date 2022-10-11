import {Field, Form, isField} from '@givewp/forms/types';
import generateRequiredLabel from './generateRequiredLabel';
import {walkGroup} from './groups';

/**
 * Receives the form data as provided directly from the server and mutates it to be ready for use by the React application
 *
 * @unreleased
 */
export default function prepareFormData(form: Form) {
    walkGroup(
        form,
        (field: Field) => {
            field.requiredLabel = generateRequiredLabel(field.label, field.validationRules.required);
        },
        isField
    );
}
