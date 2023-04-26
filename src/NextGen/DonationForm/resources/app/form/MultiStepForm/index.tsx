import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';

import getWindowData from '../../utilities/getWindowData';
import {Field, isField, Section} from '@givewp/forms/types';
import {withTemplateWrapper} from '../../templates';
import {useCallback} from 'react';
import SectionNode from '../../fields/SectionNode';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import handleSubmitRequest from '@givewp/forms/app/utilities/handleFormSubmitRequest';
import {createHashRouter, Outlet, RouteObject, RouterProvider, useNavigate} from 'react-router-dom';
import {useDonationFormState, useDonationFormStateDispatch} from '@givewp/forms/app/store';
import {setFormDefaultValues} from '@givewp/forms/app/store/reducer';
import Header from '@givewp/forms/app/form/Header';
import {__} from '@wordpress/i18n';

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
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <section className="givewp-layouts givewp-layouts-section">
                <button
                    type="button"
                    onClick={() => {
                        navigate(`/donate/steps/1`);
                    }}
                >
                    {__('Donate Now', 'give')}
                </button>
            </section>
        </div>
    );
}

const getSectionFieldNames = (section: Section) =>
    section.reduceNodes(
        (names, field: Field) => {
            return names.concat(field.name);
        },
        [],
        isField
    );

function StepForm({section, currentStep, isFirstStep, isLastStep}) {
    const {gateways, defaultValues, validationSchema} = useDonationFormState();
    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);
    const dispatch = useDonationFormStateDispatch();
    const navigate = useNavigate();
    const sectionFieldNames = getSectionFieldNames(section);

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
                                            navigate(`/`);
                                        } else {
                                            navigate(`/donate/steps/${previousStep}`);
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
                                            dispatch(setFormDefaultValues(getValues()));

                                            navigate(`/donate/steps/${currentStep + 1}`);
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

const convertSectionsToRoutes = (sections: Section[], showHeader: boolean) => {
    const totalSteps = sections.length;

    return sections.map((section, index) => {
        const currentStep = index;
        const isFirstStep = currentStep === 0;
        const isLastStep = currentStep === totalSteps - 1;

        if (isFirstStep) {
            return {
                index: true,
                element: showHeader ? (
                    <div>
                        <HeaderStep />
                    </div>
                ) : (
                    <StepForm
                        key={currentStep}
                        section={section}
                        currentStep={currentStep}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                    />
                ),
            };
        }

        return {
            path: `donate/steps/${currentStep}`,
            element: (
                <StepForm
                    key={currentStep}
                    section={section}
                    currentStep={currentStep}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                />
            ),
        } as RouteObject;
    });
};

export default function MultiStepForm() {
    const {sections} = useDonationFormState();
    const showHeader = true;
    const routes = convertSectionsToRoutes(sections, showHeader);

    //TODO try out browser router
    const router = createHashRouter([
        {
            path: '/',
            element: (
                <div>
                    <Outlet />
                </div>
            ),
            children: routes,
        },
    ]);

    return <RouterProvider router={router} />;
}

type FormInputs = {
    FORM_ERROR: string;
    amount: number;
    firstName: string;
    lastName: string;
    email: string;
    gatewayId: string;
};
