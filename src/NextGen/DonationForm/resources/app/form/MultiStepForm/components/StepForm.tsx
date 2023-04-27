import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';
import {Section} from '@givewp/forms/types';
import {useCallback} from 'react';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import handleSubmitRequest from '@givewp/forms/app/utilities/handleFormSubmitRequest';
import {useDonationFormState} from '@givewp/forms/app/store';
import {FormInputs} from '@givewp/forms/app/form/MultiStepForm/types';
import SubmitButton from '@givewp/forms/app/form/MultiStepForm/components/SubmitButton';
import getSectionFieldNames from '@givewp/forms/app/form/MultiStepForm/utilities/convertSectionsToSteps';
import usePreviousStep from '@givewp/forms/app/form/MultiStepForm/hooks/usePreviousStep';
import useNextStep from '@givewp/forms/app/form/MultiStepForm/hooks/useNextStep';
import {withTemplateWrapper} from '@givewp/forms/app/templates';
import getWindowData from '@givewp/forms/app/utilities/getWindowData';
import SectionNode from '@givewp/forms/app/fields/SectionNode';

const {donateUrl, inlineRedirectRoutes} = getWindowData();
const formTemplates = window.givewp.form.templates;

const MultiStepFormTemplate = withTemplateWrapper(formTemplates.layouts.multiStepForm);
const FormSectionTemplate = withTemplateWrapper(formTemplates.layouts.section, 'section');
/**
 * @unreleased
 */
export default function StepForm({section, currentStep, isFirstStep, isLastStep}: {
    section: Section;
    currentStep: number;
    isFirstStep: boolean;
    isLastStep: boolean
}) {
    const {gateways, defaultValues, validationSchema} = useDonationFormState();
    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);
    const sectionFieldNames = getSectionFieldNames(section);
    const setPreviousStep = usePreviousStep(currentStep);
    const setNextStep = useNextStep(currentStep);

    const methods = useForm<FormInputs>({
        defaultValues,
        resolver: joiResolver(validationSchema),
        reValidateMode: 'onBlur',
    });

    const {handleSubmit, setError, control, getValues, trigger} = methods;

    const {errors, isSubmitting, isSubmitSuccessful} = useFormState({control});

    const formError = errors.hasOwnProperty('FORM_ERROR') ? errors.FORM_ERROR.message : null;

    return (
        <FormProvider {...methods}>
            <DonationFormErrorBoundary>
                <MultiStepFormTemplate
                    formProps={{
                        id: 'givewp-donation-form',
                        onSubmit: handleSubmit((values) =>
                            handleSubmitRequest(
                                values,
                                setError,
                                getGateway(values.gatewayId),
                                donateUrl,
                                inlineRedirectRoutes
                            )
                        ),
                    }}
                    isSubmitting={isSubmitting || isSubmitSuccessful}
                    formError={formError}
                    previousButton={
                        !isFirstStep && (
                            <div>
                                <button type="button" onClick={() => setPreviousStep()}>
                                    Previous
                                </button>
                            </div>
                        )
                    }
                    nextButton={
                        !isLastStep && (
                            <div>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const valid = await trigger(sectionFieldNames);

                                        if (valid) {
                                            setNextStep(getValues());
                                        }
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )
                    }
                    submitButton={isLastStep && <SubmitButton isSubmitting={isSubmitting || isSubmitSuccessful} />}
                >
                    <DonationFormErrorBoundary key={section.name}>
                        <FormSectionTemplate key={section.name} section={section}>
                            {section.nodes.map((node) => (
                                <DonationFormErrorBoundary key={node.name}>
                                    <SectionNode key={node.name} node={node} />
                                </DonationFormErrorBoundary>
                            ))}
                        </FormSectionTemplate>
                    </DonationFormErrorBoundary>
                </MultiStepFormTemplate>
            </DonationFormErrorBoundary>
        </FormProvider>
    );
}