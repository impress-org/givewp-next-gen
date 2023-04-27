import {Section} from '@givewp/forms/types';
import {useDonationFormState} from '@givewp/forms/app/store';
import {__} from '@wordpress/i18n';
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