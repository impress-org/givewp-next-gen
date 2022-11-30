import {Field} from '@givewp/forms/types';
import {FieldProps} from '@givewp/forms/propTypes';
import {UseFormReturn} from 'react-hook-form';
import buildRegisterValidationOptions from './buildRegisterValidationOptions';
import getErrorByFieldName from './getErrorByFieldName';
import {withTemplateWrapper} from '@givewp/forms/app/templates';
import getFormDesign from '@givewp/forms/app/utilities/getFormDesign';

const formDesign = getFormDesign();
const LabelTemplate = withTemplateWrapper(formDesign.layouts.fieldLabel);
const ErrorMessageTemplate = withTemplateWrapper(formDesign.layouts.fieldError);

export default function registerFieldAndBuildProps(
    field: Field,
    register: UseFormReturn['register'],
    errors
): FieldProps {
    const fieldError = getErrorByFieldName(errors, field.name);

    return {
        ...field,
        inputProps: register(field.name, buildRegisterValidationOptions(field.validationRules)),
        fieldError,
        Label: () => <LabelTemplate label={field.label} required={field.validationRules.required} />,
        ErrorMessage: () => <ErrorMessageTemplate error={fieldError} />,
    };
}
