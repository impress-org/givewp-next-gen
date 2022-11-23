import {Element, Field, Gateway, Group, Section as SectionType, SelectOption} from '@givewp/forms/types';
import {UseFormRegisterReturn} from 'react-hook-form';
import {FC, FormHTMLAttributes, ReactNode} from 'react';

export interface FieldProps extends Field {
    inputProps: UseFormRegisterReturn;
    Label: FC;
    ErrorMessage: FC;
}

export interface GatewayFieldProps extends FieldProps {
    gateways: Gateway[];
}

export interface SelectFieldProps extends FieldProps {
    options: Array<SelectOption>;
}

export interface ElementProps extends Element {}

export interface GroupProps extends Group {
    fieldProps: {
        [key: string]: FieldProps;
    };
}

export interface HtmlProps extends ElementProps {
    html: string;
}

export interface NameProps extends GroupProps {
    fieldProps: {
        honorific: SelectFieldProps | null;
        firstName: FieldProps;
        lastName: FieldProps | null;
    };
}

export interface AmountProps extends FieldProps {
    levels: Number[];
    allowCustomAmount: boolean;
}

export interface ParagraphProps extends ElementProps {
    content: string;
}

export interface SectionProps {
    section: SectionType;
    children: ReactNode;
}

export interface FormProps {
    formProps: FormHTMLAttributes<unknown>;
    children: ReactNode;
    formError: string | null;
    isSubmitting: boolean;
}

export interface FieldErrorProps {
    error: string;
}

export interface FieldLabelProps {
    label: string;
    required: boolean;
}

export enum GoalType {
    AMOUNT = 'amount',
    DONATIONS = 'donations',
    DONORS = 'donors',
}

export interface GoalProps {
    currency: string;
    type: GoalType;
    currentAmount: number;
    currentAmountFormatted: string;
    targetAmount: number;
    targetAmountFormatted: string;
    goalLabel: string;
    progressPercentage: number;
    totalRevenue: number;
    totalRevenueFormatted: string;
    totalCountValue: number;
    totalCountLabel: string;
}

export interface HeaderProps {
    Title: FC;
    Description: FC;
    Goal: FC;
}

export interface HeaderDescriptionProps {
    text: string;
}

export interface HeaderTitleProps {
    text: string;
}
