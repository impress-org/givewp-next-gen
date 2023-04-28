import {Section} from '@givewp/forms/types';
import {useDonationFormState} from '@givewp/forms/app/store';
import {DonationFormMultiStepStateProvider, useDonationFormMultiStepState} from './store';
import {StepObject} from '@givewp/forms/app/form/MultiStepForm/types';
import StepForm from '@givewp/forms/app/form/MultiStepForm/components/StepForm';
import HeaderStep from '@givewp/forms/app/form/MultiStepForm/components/HeaderStep';
import classNames from 'classnames';
import PreviousButton from '@givewp/forms/app/form/MultiStepForm/components/PreviousButton';
import getSectionFieldNames from '@givewp/forms/app/form/MultiStepForm/utilities/getSectionFieldNames';
import {ReactNode} from 'react';
import StepHeader from '@givewp/forms/app/form/MultiStepForm/components/StepHeader';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import {withTemplateWrapper} from '@givewp/forms/app/templates';
import SectionNode from '@givewp/forms/app/fields/SectionNode';
import {__} from '@wordpress/i18n';
import StepsPagination from '@givewp/forms/app/form/MultiStepForm/components/StepsPagination';

const FormSectionTemplate = withTemplateWrapper(window.givewp.form.templates.layouts.section, 'section');

/**
 * @unreleased
 */
const convertSectionsToSteps = (sections: Section[], showHeader: boolean) => {
    const totalSteps = sections.length;

    return sections.map((section, index) => {
        const currentStep = index;
        const isFirstStep = currentStep === 0;
        const isLastStep = currentStep === totalSteps - 1;
        const fields = getSectionFieldNames(section);
        const title = section?.label;
        const description = section?.description;

        const element =
            showHeader && isFirstStep ? (
                <HeaderStep />
            ) : (
                <StepForm key={currentStep} currentStep={currentStep} isFirstStep={isFirstStep} isLastStep={isLastStep}>
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
            );

        return {
            id: currentStep,
            title,
            description,
            element,
            fields,
        } as StepObject;
    });
};

/**
 * @unreleased
 *
 * This loops through the steps and lazy loads them using a waterfall approach.
 * Only current and previous steps are rendered.  Obviously all previous steps are hidden.
 * This is necessary so the next step is always updated with the form values.
 * The other reason is so gateway scripts remain loaded on the page and are not removed by unmounting the step..
 *
 */
function Steps({steps}: { steps: StepObject[] }) {
    const {currentStep} = useDonationFormMultiStepState();

    return steps.map(({id, element}) => {
        const shouldRenderElement = currentStep >= id;
        const isCurrentStep = id === currentStep;
        const isPreviousStep = id === currentStep - 1;
        const isNextStep = id === currentStep + 1;
        const isFirstStep = id === 0;

        const stepClasses = classNames('givewp-donation-form-step', {
            'givewp-donation-form__step--start': isFirstStep,
            'givewp-donation-form__step--current': isCurrentStep && !isFirstStep,
            'givewp-donation-form__step--hidden': !isCurrentStep && !isPreviousStep && !isNextStep,
            'givewp-donation-form__step--previous': isPreviousStep,
            'givewp-donation-form__step--next': isNextStep,
        });

        return (
            <div key={id} id={`givewp-donation-form-step-${id}`} className={stepClasses}>
                {shouldRenderElement && element}
            </div>
        );
    });
}

/**
 * @unreleased
 */
function StepsContainer({children}: { children: ReactNode }) {
    return (
        <div className="givewp-donation-form__steps">
            <div className="givewp-donation-form__steps--header">
                <div className="givewp-donation-form__steps--header-previous">
                    <PreviousButton>
                        <i className="fas fa-chevron-left"></i>
                    </PreviousButton>
                </div>
                <div className="givewp-donation-form__steps--header-title">
                    <StepHeader />
                </div>
            </div>
            <div className="givewp-donation-form__steps--body">{children}</div>
            <div className="givewp-donation-form__steps--footer">
                <div className="givewp-donation-form__steps--footer-pagination">
                    <StepsPagination />
                </div>
                <div className="givewp-donation-form__steps--footer-secure">
                    <i className="fas fa-lock secure-icon"></i>
                    <small className="secure-text">{__('Secure Donation', 'give')}</small>
                </div>
            </div>
        </div>
    );
}

/**
 * @unreleased
 */
export default function MultiStepForm() {
    const {sections} = useDonationFormState();
    const showHeader = true;
    const steps: StepObject[] = convertSectionsToSteps(sections, showHeader);

    return (
        <DonationFormMultiStepStateProvider initialState={{steps, currentStep: 0}}>
            <StepsContainer>
                <Steps steps={steps} />
            </StepsContainer>
        </DonationFormMultiStepStateProvider>
    );
}