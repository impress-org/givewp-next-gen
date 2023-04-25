import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';

import getWindowData from '../utilities/getWindowData';
import {useGiveDonationFormStore} from '../store';
import {Section} from '@givewp/forms/types';
import {withTemplateWrapper} from '../templates';
import {useCallback} from 'react';
import SectionNode from '../fields/SectionNode';
import {ObjectSchema} from 'joi';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import handleSubmitRequest from '@givewp/forms/app/utilities/handleFormSubmitRequest';
import {createHashRouter, Link, Outlet, RouteObject, RouterProvider} from 'react-router-dom';

const {donateUrl, inlineRedirectRoutes} = getWindowData();
const formTemplates = window.givewp.form.templates;

const FormTemplate = withTemplateWrapper(formTemplates.layouts.form);
const FormSectionTemplate = withTemplateWrapper(formTemplates.layouts.section, 'section');

function FormStepSection({section}: {section: Section}) {
    {
        return (
            <DonationFormErrorBoundary key={section.name}>
                <FormSectionTemplate key={section.name} section={section}>
                    {section.nodes.map((node) => (
                        <DonationFormErrorBoundary key={node.name}>
                            <SectionNode key={node.name} node={node} />
                        </DonationFormErrorBoundary>
                    ))}
                </FormSectionTemplate>
            </DonationFormErrorBoundary>
        );
    }
}

function FormStep({defaultValues, validationSchema, section}) {
    const {gateways} = useGiveDonationFormStore();

    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);

    const methods = useForm<FormInputs>({
        defaultValues,
        resolver: joiResolver(validationSchema),
        reValidateMode: 'onBlur',
    });

    const {handleSubmit, setError, control} = methods;

    const {errors, isSubmitting, isSubmitSuccessful} = useFormState({control});

    const formError = errors.hasOwnProperty('FORM_ERROR') ? errors.FORM_ERROR.message : null;

    return (
        <FormProvider {...methods}>
            <DonationFormErrorBoundary>
                <FormTemplate
                    formProps={{
                        id: 'give-next-gen',
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
                >
                    <FormStepSection section={section} />
                </FormTemplate>
            </DonationFormErrorBoundary>
        </FormProvider>
    );
}

const convertSectionsToRoutes = (sections: Section[], defaultValues, validationSchema) => {
    const totalSteps = sections.length;

    return sections.map((section, index) => {
        const isFirstStep = index === 0;
        const isLastStep = index === totalSteps - 1;

        return {
            index: isFirstStep,
            path: !isFirstStep ? `donate/steps/${index}` : undefined,
            element: (
                <>
                    <FormStep
                        key={index}
                        defaultValues={defaultValues}
                        validationSchema={validationSchema}
                        section={section}
                    />
                    <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        {!isFirstStep ? (
                            <Link to={index === 1 ? '/' : `/donate/steps/${index - 1}`}>Previous</Link>
                        ) : (
                            <div />
                        )}
                        {!isLastStep && <Link to={`/donate/steps/${index + 1}`}>Next</Link>}
                    </nav>
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

export default function MultiStepForm({defaultValues, validationSchema, sections}: PropTypes) {
    const routes = convertSectionsToRoutes(sections, defaultValues, validationSchema);

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

type PropTypes = {
    sections: Section[];
    defaultValues: object;
    validationSchema: ObjectSchema;
};

type FormInputs = {
    FORM_ERROR: string;
    amount: number;
    firstName: string;
    lastName: string;
    email: string;
    gatewayId: string;
};
