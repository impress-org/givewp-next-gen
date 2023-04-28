import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import getCurrentStepObject from '@givewp/forms/app/form/MultiStepForm/utilities/getCurrentStepObject';
import {StepObject} from '@givewp/forms/app/form/MultiStepForm/types';

export default function useCurrentStep(): StepObject {
    const {steps, currentStep} = useDonationFormMultiStepState();

    return getCurrentStepObject(steps, currentStep);
}