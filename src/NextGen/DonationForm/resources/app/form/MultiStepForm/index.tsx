import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';

import getWindowData from '../../utilities/getWindowData';
import {Field, isField, Section} from '@givewp/forms/types';
import {withTemplateWrapper} from '../../templates';
import {useCallback} from 'react';
import SectionNode from '../../fields/SectionNode';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import handleSubmitRequest from '@givewp/forms/app/utilities/handleFormSubmitRequest';
import {useDonationFormState, useDonationFormStateDispatch} from '@givewp/forms/app/store';
import {setFormDefaultValues} from '@givewp/forms/app/store/reducer';
import Header from '@givewp/forms/app/form/Header';
import {__} from '@wordpress/i18n';
import {
    DonationFormMultiStepStateProvider,
    useDonationFormMultiStepState,
    useDonationFormMultiStepStateDispatch,
} from './store';
import {setCurrentStep} from '@givewp/forms/app/form/MultiStepForm/reducer';
import {FormInputs, StepObject} from '@givewp/forms/app/form/MultiStepForm/types';

const {donateUrl, inlineRedirectRoutes} = getWindowData();
const formTemplates = window.givewp.form.templates;

const MultiStepFormTemplate = withTemplateWrapper(formTemplates.layouts.multiStepForm);
const FormSectionTemplate = withTemplateWrapper(formTemplates.layouts.section, 'section');

const SubmitButton = ({
    isSubmitting,
    submittingText = __('Submitting…', 'give'),
    buttonText = __('Donate Now', 'give'),
}) => (
    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? submittingText : buttonText}
    </button>
);

function HeaderStep() {
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();

    return (
        <div>
            <Header />
            <section className="givewp-layouts givewp-layouts-section">
                <button
                    type="button"
                    onClick={() => {
                        dispatchMultiStep(setCurrentStep(1));
                    }}
                >
                    {__('Donate Now', 'give')}
                </button>
            </section>
        </div>
    );
}

/**
 * @unreleased
 */
const getSectionFieldNames = (section: Section) =>
    section.reduceNodes(
        (names, field: Field) => {
            return names.concat(field.name);
        },
        [],
        isField
    );

/**
 * @unreleased
 */
function StepForm({section, currentStep, isFirstStep, isLastStep}: {
    section: Section;
    currentStep: number;
    isFirstStep: boolean;
    isLastStep: boolean
}) {
    const {gateways, defaultValues, validationSchema} = useDonationFormState();
    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);
    const dispatchForm = useDonationFormStateDispatch();
    const sectionFieldNames = getSectionFieldNames(section);
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();

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
                        !isFirstStep ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const previousStep = currentStep - 1;

                                        if (previousStep <= 0) {
                                            dispatchMultiStep(setCurrentStep(0));
                                        } else {
                                            dispatchMultiStep(setCurrentStep(previousStep));
                                        }
                                    }}
                                >
                                    Previous
                                </button>
                            </div>
                        ) : (
                            <div />
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
                                            dispatchForm(setFormDefaultValues(getValues()));

                                            dispatchMultiStep(setCurrentStep(currentStep + 1));
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

const convertSectionsToSteps = (sections: Section[], showHeader: boolean) => {
    const totalSteps = sections.length;

    return sections.map((section, index) => {
        const currentStep = index;
        const isFirstStep = currentStep === 0;
        const isLastStep = currentStep === totalSteps - 1;
        const element =
            showHeader && isFirstStep ? (
                <HeaderStep />
            ) : (
                <StepForm
                    key={currentStep}
                    section={section}
                    currentStep={currentStep}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                />
            );

        return {
            id: currentStep,
            element,
        };
    });
};

/**
 * @unreleased
 */
function Steps({steps}: { steps: StepObject[] }) {
    const {currentStep} = useDonationFormMultiStepState();

    for (const {id, element} of steps) {
        if (id === currentStep) {
            return element;
        }
    }

    return <p>{__('GiveWP form unable to load.')}</p>;
}

/**
 * @unreleased
 */
export default function MultiStepForm() {
    const {sections} = useDonationFormState();
    const showHeader = true;
    const steps: StepObject[] = convertSectionsToSteps(sections, showHeader);

    return (
        <DonationFormMultiStepStateProvider initialState={{currentStep: 0}}>
            <Steps steps={steps}/>
        </DonationFormMultiStepStateProvider>
    );
}