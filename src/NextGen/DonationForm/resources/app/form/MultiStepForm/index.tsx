import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';

import getWindowData from '../../utilities/getWindowData';
import {Section} from '@givewp/forms/types';
import {withTemplateWrapper} from '../../templates';
import {useCallback} from 'react';
import SectionNode from '../../fields/SectionNode';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import handleSubmitRequest from '@givewp/forms/app/utilities/handleFormSubmitRequest';
import {createHashRouter, Link, Outlet, RouteObject, RouterProvider, useNavigate} from 'react-router-dom';
import Form from './Form';
import {setFormDefaultValues} from '@givewp/forms/app/store/reducer';
import {useDonationFormState, useDonationFormStoreDispatch} from '@givewp/forms/app/store';

const {donateUrl, inlineRedirectRoutes} = getWindowData();
const formTemplates = window.givewp.form.templates;
window.givewp.form.templates.layouts.form = Form;

const FormTemplate = withTemplateWrapper(window.givewp.form.templates.layouts.form);
const FormSectionTemplate = withTemplateWrapper(formTemplates.layouts.section, 'section');

function StepForm({children, currentStep, isFirstStep, isLastStep}) {
    const {gateways, defaultValues, validationSchema} = useDonationFormState();
    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);
    const dispatch = useDonationFormStoreDispatch();
    const navigate = useNavigate();

    const methods = useForm<FormInputs>({
        defaultValues,
        resolver: joiResolver(validationSchema),
        reValidateMode: 'onBlur',
    });

    const {handleSubmit, setError, control, getValues} = methods;

    const {errors, isSubmitting, isSubmitSuccessful} = useFormState({control});

    const formError = errors.hasOwnProperty('FORM_ERROR') ? errors.FORM_ERROR.message : null;

    return (
        <FormProvider {...methods}>
            <DonationFormErrorBoundary>
                <FormTemplate
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
                    hideSubmitButton={!isLastStep}
                >
                    {children}

                    <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        {!isFirstStep ? (
                            <div>
                                <Link to={currentStep === 1 ? '/' : `/donate/steps/${currentStep - 1}`}>
                                    <button type="button">Previous</button>
                                </Link>
                            </div>
                        ) : (
                            <div />
                        )}
                        {!isLastStep && (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const values = getValues();

                                        dispatch(setFormDefaultValues(values));
                                        navigate(`/donate/steps/${currentStep + 1}`);
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </nav>
                </FormTemplate>
            </DonationFormErrorBoundary>
        </FormProvider>
    );
}

const convertSectionsToRoutes = (sections: Section[]) => {
    const totalSteps = sections.length;

    return sections.map((section, index) => {
        const isFirstStep = index === 0;
        const isLastStep = index === totalSteps - 1;

        return {
            index: isFirstStep,
            path: !isFirstStep ? `donate/steps/${index}` : undefined,
            element: (
                <>
                    <StepForm key={index} currentStep={index} isFirstStep={isFirstStep} isLastStep={isLastStep}>
                        <DonationFormErrorBoundary key={section.name}>
                            <FormSectionTemplate key={section.name} section={section}>
                                {section.nodes.map((node) => (
                                    <DonationFormErrorBoundary key={node.name}>
                                        <SectionNode key={node.name} node={node} />
                                    </DonationFormErrorBoundary>
                                ))}
                            </FormSectionTemplate>
                        </DonationFormErrorBoundary>
                    </StepForm>
                </>
            ),
        } as RouteObject;
    });
};

const Root = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default function MultiStepForm() {
    const {sections} = useDonationFormState();
    const routes = convertSectionsToRoutes(sections);

    //TODO try out browser router
    const router = createHashRouter([
        {
            path: '/',
            element: <Root />,
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
