import {Field} from '@givewp/forms/types';
import {FieldProps} from '@givewp/forms/propTypes';
import {UseFormReturn} from 'react-hook-form';
import buildRegisterValidationOptions from './buildRegisterValidationOptions';
import getErrorByFieldName from './getErrorByFieldName';
import {TemplateWrapper} from '@givewp/blocks/form/app/templates';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();
const LabelTemplate = formDesign.layouts.fieldLabel;
const ErrorMessageTemplate = formDesign.layouts.fieldError;

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
        Label: () => (
            <TemplateWrapper>
                <LabelTemplate label={field.label} required={field.validationRules.required} />
            </TemplateWrapper>
        ),
        ErrorMessage: () => (
            <TemplateWrapper>
                <ErrorMessageTemplate error={fieldError} />
            </TemplateWrapper>
        ),
    };
}
