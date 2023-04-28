import {Section} from '@givewp/forms/types';
import {useDonationFormState} from '@givewp/forms/app/store';
import {DonationFormMultiStepStateProvider, useDonationFormMultiStepState,} from './store';
import {StepObject} from '@givewp/forms/app/form/MultiStepForm/types';
import StepForm from '@givewp/forms/app/form/MultiStepForm/components/StepForm';
import HeaderStep from "@givewp/forms/app/form/MultiStepForm/components/HeaderStep";

/**
 * @unreleased
 */
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
        const shouldShowStep = id === currentStep;
        const shouldRenderElement = currentStep >= id;

        return (
            <div
                key={id}
                id={`givewp-donation-form-step-${id}`}
                className={`givewp-donation-form-step givewp-donation-form-step-${
                    shouldShowStep ? 'visible' : 'hidden'
                }`}
                style={{
                    //TODO: add css transition/animation
                    display: shouldShowStep ? 'block' : 'none',
                }}
            >
                {shouldRenderElement && element}
            </div>
        );
    });
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