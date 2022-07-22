import {FormProvider, useForm, useFormContext, useFormState, useWatch} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';
import Joi from 'joi';

import getFieldErrorMessages from '../utilities/getFieldErrorMessages';
import SectionNodes from '../fields/SectionNodes';
import getWindowData from '../utilities/getWindowData';
import PaymentDetails from '../fields/PaymentDetails';
import DonationReceipt from './DonationReceipt';
import {useGiveDonationFormStore} from '../store';
import type {Gateway, Section} from '@givewp/forms/types';
import postData from '../utilities/postData';
import {getFormTemplate, getSectionTemplate} from '../templates';
import {useCallback} from "react";

window.givewp.form = {
    useFormContext,
    useWatch,
};

const messages = getFieldErrorMessages();

const {donateUrl} = getWindowData();

const FormTemplate = getFormTemplate();

const SectionTemplate = getSectionTemplate();

const schema = Joi.object({
    firstName: Joi.string().required().label('First Name').messages(messages),
    lastName: Joi.string().required().label('Last Name').messages(messages),
    email: Joi.string().email({tlds: false}).required().label('Email').messages(messages),
    amount: Joi.number().integer().min(5).required().label('Donation Amount'),
    gatewayId: Joi.string().required().label('Payment Gateway').messages(messages),
    formId: Joi.number().required(),
    currency: Joi.string().required(),
    formTitle: Joi.string().required(),
    userId: Joi.number().required(),
}).unknown();

const handleSubmitRequest = async (values, setError, gateway: Gateway) => {
    let beforeCreatePaymentGatewayResponse = {};

    try {
        if (gateway.beforeCreatePayment) {
            beforeCreatePaymentGatewayResponse = await gateway.beforeCreatePayment(values);
        }
    } catch (error) {
        return setError('FORM_ERROR', {message: error.message});
    }

    const request = await postData(donateUrl, {
        ...values,
        ...beforeCreatePaymentGatewayResponse,
    });

    if (!request.response.ok) {
        return setError('FORM_ERROR', {message: 'Something went wrong, please try again or contact support.'});
    }

    try {
        if (gateway.afterCreatePayment) {
            await gateway.afterCreatePayment(request.data);
        }
    } catch (error) {
        return setError('FORM_ERROR', {message: error.message});
    }
};

export default function Form({sections, defaultValues}: PropTypes) {
    const {gateways} = useGiveDonationFormStore();

    const getGateway = useCallback((gatewayId) => gateways.find(({id}) => id === gatewayId), []);

    const methods = useForm<FormInputs>({
        defaultValues,
        resolver: joiResolver(schema),
    });

    const {
        handleSubmit,
        setError,
        getValues,
        control
    } = methods;

    const {errors, isSubmitting, isSubmitSuccessful} = useFormState({control});

    const formError = errors.hasOwnProperty('FORM_ERROR') ? errors.FORM_ERROR.message : null;

    if (isSubmitSuccessful) {
        const {amount, firstName, lastName, email, gatewayId} = getValues();
        const gateway = gateways.find(({id}) => id === gatewayId);

        return (
            <DonationReceipt
                amount={amount}
                email={email}
                firstName={firstName}
                lastName={lastName}
                gateway={gateway}
                status={'Complete'}
                total={amount}
            />
        );
    }

    const renderedSections = sections.map((section) => {
        if (section.name === 'payment-gateways') {
            return <PaymentDetails gateways={gateways} key={section.name} {...section} />;
        }

        return (
            <SectionTemplate key={section.name} section={section}>
                <SectionNodes key={section.name} {...section} />
            </SectionTemplate>
        );
    });

    return (
        <FormProvider {...methods}>
            <FormTemplate
                formProps={{
                    id: 'give-next-gen',
                    onSubmit: handleSubmit((values) =>
                        handleSubmitRequest(values, setError, getGateway(values.gatewayId))
                    ),
                }}
                isSubmitting={isSubmitting}
                formError={formError}
            >
                {renderedSections}
            </FormTemplate>
        </FormProvider>
    );
}

type PropTypes = {
    sections: Section[];
    defaultValues: object;
};

type FormInputs = {
    FORM_ERROR: string;
    amount: number;
    firstName: string;
    lastName: string;
    email: string;
    gatewayId: string;
};
