import {useDonationFormMultiStepStateDispatch} from '@givewp/forms/app/form/MultiStepForm/store';
import {setCurrentStep} from '@givewp/forms/app/form/MultiStepForm/store/reducer';

/**
 * @unreleased
 */
export default function usePreviousStep() {
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();

    return (currentStep: number) => {
        const previousStep = currentStep - 1;

        if (previousStep <= 0) {
            dispatchMultiStep(setCurrentStep(0));
        } else {
            dispatchMultiStep(setCurrentStep(previousStep));
        }
    };
}